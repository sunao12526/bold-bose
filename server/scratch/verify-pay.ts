import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/prisma/prisma.service';
import { OrderService } from '../src/modules/mall/order/order.service';
import { RefundService } from '../src/modules/mall/refund/refund.service';
import { PayOrderService } from '../src/modules/pay/pay-order.service';
import { PayRefundService } from '../src/modules/pay/pay-refund.service';
import { JobHandlers } from '../src/modules/infra/job/job.handlers';
import { MallOrderStatus, MallRefundStatus, PayOrderStatus, PayRefundStatus, PayNotifyStatus, PayNotifyType, CommonStatus } from '@prisma/client';

async function main() {
  console.log('--- Bootstrapping Payment Module Programmatic Test ---');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('admin-api');
  
  // Listen on isolated port 3010 to prevent conflicts and catch webhooks
  const testPort = 3010;
  await app.listen(testPort);
  console.log(`Test NestJS server listening on http://localhost:${testPort}`);

  const prisma = app.get(PrismaService);
  const orderService = app.get(OrderService);
  const refundService = app.get(RefundService);
  const payOrderService = app.get(PayOrderService);
  const payRefundService = app.get(PayRefundService);
  const jobHandlers = app.get(JobHandlers);

  const testMobile = '17777777777';
  
  try {
    // 0. Clean up any stale test records first
    await prisma.mallOrderRefund.deleteMany({ where: { no: { startsWith: 'TESTREF' } } });
    await prisma.mallOrder.deleteMany({ where: { no: { startsWith: 'TESTORD' } } });
    await prisma.memberUser.deleteMany({ where: { mobile: testMobile } });
    await prisma.payOrder.deleteMany({ where: { merchantOrderId: { startsWith: 'TESTORD' } } });

    // 1. Create a test member user
    console.log('\nStep 1: Creating test member user...');
    const member = await prisma.memberUser.create({
      data: {
        nickname: '支付测试会员',
        mobile: testMobile,
        avatar: '/avatars/pay_test.png',
        points: 0,
        balance: 500000, // 5000.00 yuan
      },
    });
    console.log(`- Member ID: ${member.id}, Nickname: ${member.nickname}, Balance: ${member.balance} cents`);

    // 2. Create unpaid Mall Order
    console.log('\nStep 2: Creating unpaid Mall Order...');
    const orderNo = 'TESTORD10001';
    const order = await prisma.mallOrder.create({
      data: {
        no: orderNo,
        memberId: member.id,
        status: MallOrderStatus.UNPAID,
        totalPrice: 100000, // 1000.00 yuan
        payPrice: 100000,
        receiverName: '测试收件人',
        receiverMobile: '18888888888',
        receiverAddress: '北京朝阳区测试路9号',
      },
    });
    console.log(`- Mall Order ID: ${order.id}, No: ${order.no}, Status: ${order.status}`);

    // 3. Perform Mock Payment (Runs through PayModule and calls Mall Webhook)
    console.log('\nStep 3: Triggering mock pay on the order...');
    // We mock the HTTP endpoint to route to port 3010
    const originalCreate = payOrderService.createPayOrder.bind(payOrderService);
    payOrderService.createPayOrder = async (data: any) => {
      data.merchantNotifyUrl = `http://localhost:${testPort}/admin-api/mall/order/pay-notify`;
      return originalCreate(data);
    };

    await orderService.payMock(order.id);
    console.log('- Mock payment initiated. Waiting for callback hook...');

    // Wait 1.5 seconds for the webhook callback
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check order and pay order statuses
    const updatedOrder = await prisma.mallOrder.findUnique({ where: { id: order.id } });
    const payOrder = await prisma.payOrder.findFirst({
      where: { merchantOrderId: orderNo },
      include: { notifyLogs: true },
    });

    console.log('Order status updated check:');
    console.log(`- Mall Order Status: ${updatedOrder?.status} (Expected: UNDELIVERED)`);
    console.log(`- Mall Order Pay Time: ${updatedOrder?.payTime ? 'SET' : 'MISSING'} (Expected: SET)`);
    console.log(`- Pay Order Status: ${payOrder?.status} (Expected: SUCCESS)`);
    console.log(`- Pay Order Notify Status: ${payOrder?.notifyStatus} (Expected: SUCCESS)`);
    console.log(`- Pay Order Webhook Attempt Count: ${payOrder?.notifyLogs[0]?.attemptCount} (Expected: 1)`);

    if (updatedOrder?.status !== MallOrderStatus.UNDELIVERED || payOrder?.status !== PayOrderStatus.SUCCESS || payOrder?.notifyStatus !== PayNotifyStatus.SUCCESS) {
      throw new Error('Step 3 validation failed: Webhook payment callback did not complete successfully!');
    }

    // 4. Create refund request
    console.log('\nStep 4: Creating a refund request...');
    const refundNo = 'TESTREF20002';
    const refund = await prisma.mallOrderRefund.create({
      data: {
        no: refundNo,
        orderId: order.id,
        memberId: member.id,
        refundPrice: 40000, // 400.00 yuan refund
        status: MallRefundStatus.APPLY,
        reason: '商品质量不符合预期',
      },
    });
    console.log(`- Mall Order Refund ID: ${refund.id}, No: ${refund.no}, Status: ${refund.status}`);

    // 5. Approve Refund (Runs through PayModule and calls Mall Webhook)
    console.log('\nStep 5: Approving refund (triggering PayRefund)...');
    const originalCreateRefund = payRefundService.createRefund.bind(payRefundService);
    payRefundService.createRefund = async (data: any) => {
      data.merchantNotifyUrl = `http://localhost:${testPort}/admin-api/mall/refund/notify`;
      return originalCreateRefund(data);
    };

    await refundService.approve(refund.id, '符合退款标准');
    console.log('- Mock refund approved. Waiting for callback hook...');

    // Wait 1.5 seconds for the webhook callback
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check refund, order and member balance
    const updatedRefund = await prisma.mallOrderRefund.findUnique({ where: { id: refund.id } });
    const updatedParentOrder = await prisma.mallOrder.findUnique({ where: { id: order.id } });
    const updatedMember = await prisma.memberUser.findUnique({ where: { id: member.id } });
    const payRefund = await prisma.payRefund.findFirst({
      where: { merchantRefundId: refundNo },
      include: { notifyLogs: true },
    });

    console.log('Refund status updated check:');
    console.log(`- Refund Status: ${updatedRefund?.status} (Expected: APPROVED)`);
    console.log(`- Refund Audit Remark: "${updatedRefund?.auditRemark}" (Expected: "符合退款标准")`);
    console.log(`- Parent Order Status: ${updatedParentOrder?.status} (Expected: CANCELLED)`);
    console.log(`- Member Post-Refund Balance: ${updatedMember?.balance} cents (Expected: 540000 cents - initial 500000 + refund 40000)`);
    console.log(`- Pay Refund Status: ${payRefund?.status} (Expected: SUCCESS)`);
    console.log(`- Pay Refund Notify Status: ${payRefund?.notifyStatus} (Expected: SUCCESS)`);

    if (updatedRefund?.status !== MallRefundStatus.APPROVED || updatedParentOrder?.status !== MallOrderStatus.CANCELLED || updatedMember?.balance !== 540000 || payRefund?.status !== PayRefundStatus.SUCCESS || payRefund?.notifyStatus !== PayNotifyStatus.SUCCESS) {
      throw new Error('Step 5 validation failed: Webhook refund callback did not complete successfully!');
    }

    // 6. Test background cron retry job (payNotifyJob)
    console.log('\nStep 6: Simulating payNotifyJob retry...');
    // Create a PayOrder that has failed notification log
    const retryOrderNo = 'TESTORD_RETRY';
    
    // Create corresponding unpaid Mall Order so webhook finds it
    await prisma.mallOrder.create({
      data: {
        no: retryOrderNo,
        memberId: member.id,
        status: MallOrderStatus.UNPAID,
        totalPrice: 15000,
        payPrice: 15000,
        receiverName: '测试重试',
        receiverMobile: '18888888888',
        receiverAddress: '测试地址',
      },
    });

    const retryPayOrder = await prisma.payOrder.create({
      data: {
        appId: payOrder?.appId ?? 1,
        merchantOrderId: retryOrderNo,
        subject: '重试测试商品',
        price: 15000,
        status: PayOrderStatus.SUCCESS,
        payTime: new Date(),
        expireTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        merchantNotifyUrl: `http://localhost:${testPort}/admin-api/mall/order/pay-notify`,
        notifyStatus: PayNotifyStatus.FAIL,
      },
    });

    // Manually create a failed notify log scheduled in the past
    const failedLog = await prisma.payNotifyLog.create({
      data: {
        appId: retryPayOrder.appId,
        payOrderId: retryPayOrder.id,
        type: PayNotifyType.ORDER,
        status: PayNotifyStatus.FAIL,
        attemptCount: 1,
        lastAttemptTime: new Date(Date.now() - 60 * 1000),
        nextNotifyTime: new Date(Date.now() - 5 * 1000), // scheduled 5s ago
        responseContent: 'Internal Server Error (Simulated)',
      },
    });

    console.log(`- Failed log created. ID: ${failedLog.id}, Status: ${failedLog.status}, Attempt Count: ${failedLog.attemptCount}`);
    
    // Trigger payNotifyJob in handlers
    console.log('- Executing payNotifyJob retry task...');
    await jobHandlers.payNotifyJob();

    // Wait 1.5 seconds for execution
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const updatedLog = await prisma.payNotifyLog.findUnique({ where: { id: failedLog.id } });
    const updatedRetryPayOrder = await prisma.payOrder.findUnique({ where: { id: retryPayOrder.id } });

    console.log(`- Retried log ID: ${updatedLog?.id}`);
    console.log(`- Retried log Status: ${updatedLog?.status} (Expected: SUCCESS)`);
    console.log(`- Retried log Attempt Count: ${updatedLog?.attemptCount} (Expected: 2)`);
    console.log(`- Pay Order Notify Status: ${updatedRetryPayOrder?.notifyStatus} (Expected: SUCCESS)`);

    if (updatedLog?.status !== PayNotifyStatus.SUCCESS || updatedLog?.attemptCount !== 2 || updatedRetryPayOrder?.notifyStatus !== PayNotifyStatus.SUCCESS) {
      throw new Error('Step 6 validation failed: Retry job did not successfully deliver failed notification!');
    }

    // 7. Cleanup test data
    console.log('\nStep 7: Cleaning up test data...');
    await prisma.payNotifyLog.deleteMany({ where: { payOrderId: retryPayOrder.id } });
    await prisma.payOrder.delete({ where: { id: retryPayOrder.id } });
    await prisma.mallOrderRefund.deleteMany({ where: { no: { startsWith: 'TESTREF' } } });
    await prisma.mallOrder.deleteMany({ where: { no: { startsWith: 'TESTORD' } } });
    await prisma.memberUser.deleteMany({ where: { mobile: testMobile } });
    await prisma.payOrder.deleteMany({ where: { merchantOrderId: { startsWith: 'TESTORD' } } });

    console.log('Cleanup completed successfully.');
    console.log('\n🎉 --- ALL PAYMENT MODULE E2E CHECKS PASSED SUCCESSFULLY! ---');

  } catch (err: any) {
    console.error('\n❌ E2E Integration Checks Failed:', err);
    process.exit(1);
  } finally {
    // Shutdown NestJS application context cleanly
    await app.close();
  }
}

main();
