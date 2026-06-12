"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/shared/prisma/prisma.service");
const order_service_1 = require("../src/modules/mall/order/order.service");
const refund_service_1 = require("../src/modules/mall/refund/refund.service");
const pay_order_service_1 = require("../src/modules/pay/pay-order.service");
const pay_refund_service_1 = require("../src/modules/pay/pay-refund.service");
const job_handlers_1 = require("../src/modules/infra/job/job.handlers");
const client_1 = require("@prisma/client");
async function main() {
    console.log('--- Bootstrapping Payment Module Programmatic Test ---');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('admin-api');
    const testPort = 3010;
    await app.listen(testPort);
    console.log(`Test NestJS server listening on http://localhost:${testPort}`);
    const prisma = app.get(prisma_service_1.PrismaService);
    const orderService = app.get(order_service_1.OrderService);
    const refundService = app.get(refund_service_1.RefundService);
    const payOrderService = app.get(pay_order_service_1.PayOrderService);
    const payRefundService = app.get(pay_refund_service_1.PayRefundService);
    const jobHandlers = app.get(job_handlers_1.JobHandlers);
    const testMobile = '17777777777';
    try {
        await prisma.mallOrderRefund.deleteMany({ where: { no: { startsWith: 'TESTREF' } } });
        await prisma.mallOrder.deleteMany({ where: { no: { startsWith: 'TESTORD' } } });
        await prisma.memberUser.deleteMany({ where: { mobile: testMobile } });
        await prisma.payOrder.deleteMany({ where: { merchantOrderId: { startsWith: 'TESTORD' } } });
        console.log('\nStep 1: Creating test member user...');
        const member = await prisma.memberUser.create({
            data: {
                nickname: '支付测试会员',
                mobile: testMobile,
                avatar: '/avatars/pay_test.png',
                points: 0,
                balance: 500000,
            },
        });
        console.log(`- Member ID: ${member.id}, Nickname: ${member.nickname}, Balance: ${member.balance} cents`);
        console.log('\nStep 2: Creating unpaid Mall Order...');
        const orderNo = 'TESTORD10001';
        const order = await prisma.mallOrder.create({
            data: {
                no: orderNo,
                memberId: member.id,
                status: client_1.MallOrderStatus.UNPAID,
                totalPrice: 100000,
                payPrice: 100000,
                receiverName: '测试收件人',
                receiverMobile: '18888888888',
                receiverAddress: '北京朝阳区测试路9号',
            },
        });
        console.log(`- Mall Order ID: ${order.id}, No: ${order.no}, Status: ${order.status}`);
        console.log('\nStep 3: Triggering mock pay on the order...');
        const originalCreate = payOrderService.createPayOrder.bind(payOrderService);
        payOrderService.createPayOrder = async (data) => {
            data.merchantNotifyUrl = `http://localhost:${testPort}/admin-api/mall/order/pay-notify`;
            return originalCreate(data);
        };
        await orderService.payMock(order.id);
        console.log('- Mock payment initiated. Waiting for callback hook...');
        await new Promise((resolve) => setTimeout(resolve, 1500));
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
        if (updatedOrder?.status !== client_1.MallOrderStatus.UNDELIVERED || payOrder?.status !== client_1.PayOrderStatus.SUCCESS || payOrder?.notifyStatus !== client_1.PayNotifyStatus.SUCCESS) {
            throw new Error('Step 3 validation failed: Webhook payment callback did not complete successfully!');
        }
        console.log('\nStep 4: Creating a refund request...');
        const refundNo = 'TESTREF20002';
        const refund = await prisma.mallOrderRefund.create({
            data: {
                no: refundNo,
                orderId: order.id,
                memberId: member.id,
                refundPrice: 40000,
                status: client_1.MallRefundStatus.APPLY,
                reason: '商品质量不符合预期',
            },
        });
        console.log(`- Mall Order Refund ID: ${refund.id}, No: ${refund.no}, Status: ${refund.status}`);
        console.log('\nStep 5: Approving refund (triggering PayRefund)...');
        const originalCreateRefund = payRefundService.createRefund.bind(payRefundService);
        payRefundService.createRefund = async (data) => {
            data.merchantNotifyUrl = `http://localhost:${testPort}/admin-api/mall/refund/notify`;
            return originalCreateRefund(data);
        };
        await refundService.approve(refund.id, '符合退款标准');
        console.log('- Mock refund approved. Waiting for callback hook...');
        await new Promise((resolve) => setTimeout(resolve, 1500));
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
        if (updatedRefund?.status !== client_1.MallRefundStatus.APPROVED || updatedParentOrder?.status !== client_1.MallOrderStatus.CANCELLED || updatedMember?.balance !== 540000 || payRefund?.status !== client_1.PayRefundStatus.SUCCESS || payRefund?.notifyStatus !== client_1.PayNotifyStatus.SUCCESS) {
            throw new Error('Step 5 validation failed: Webhook refund callback did not complete successfully!');
        }
        console.log('\nStep 6: Simulating payNotifyJob retry...');
        const retryOrderNo = 'TESTORD_RETRY';
        await prisma.mallOrder.create({
            data: {
                no: retryOrderNo,
                memberId: member.id,
                status: client_1.MallOrderStatus.UNPAID,
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
                status: client_1.PayOrderStatus.SUCCESS,
                payTime: new Date(),
                expireTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
                merchantNotifyUrl: `http://localhost:${testPort}/admin-api/mall/order/pay-notify`,
                notifyStatus: client_1.PayNotifyStatus.FAIL,
            },
        });
        const failedLog = await prisma.payNotifyLog.create({
            data: {
                appId: retryPayOrder.appId,
                payOrderId: retryPayOrder.id,
                type: client_1.PayNotifyType.ORDER,
                status: client_1.PayNotifyStatus.FAIL,
                attemptCount: 1,
                lastAttemptTime: new Date(Date.now() - 60 * 1000),
                nextNotifyTime: new Date(Date.now() - 5 * 1000),
                responseContent: 'Internal Server Error (Simulated)',
            },
        });
        console.log(`- Failed log created. ID: ${failedLog.id}, Status: ${failedLog.status}, Attempt Count: ${failedLog.attemptCount}`);
        console.log('- Executing payNotifyJob retry task...');
        await jobHandlers.payNotifyJob();
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const updatedLog = await prisma.payNotifyLog.findUnique({ where: { id: failedLog.id } });
        const updatedRetryPayOrder = await prisma.payOrder.findUnique({ where: { id: retryPayOrder.id } });
        console.log(`- Retried log ID: ${updatedLog?.id}`);
        console.log(`- Retried log Status: ${updatedLog?.status} (Expected: SUCCESS)`);
        console.log(`- Retried log Attempt Count: ${updatedLog?.attemptCount} (Expected: 2)`);
        console.log(`- Pay Order Notify Status: ${updatedRetryPayOrder?.notifyStatus} (Expected: SUCCESS)`);
        if (updatedLog?.status !== client_1.PayNotifyStatus.SUCCESS || updatedLog?.attemptCount !== 2 || updatedRetryPayOrder?.notifyStatus !== client_1.PayNotifyStatus.SUCCESS) {
            throw new Error('Step 6 validation failed: Retry job did not successfully deliver failed notification!');
        }
        console.log('\nStep 7: Cleaning up test data...');
        await prisma.payNotifyLog.deleteMany({ where: { payOrderId: retryPayOrder.id } });
        await prisma.payOrder.delete({ where: { id: retryPayOrder.id } });
        await prisma.mallOrderRefund.deleteMany({ where: { no: { startsWith: 'TESTREF' } } });
        await prisma.mallOrder.deleteMany({ where: { no: { startsWith: 'TESTORD' } } });
        await prisma.memberUser.deleteMany({ where: { mobile: testMobile } });
        await prisma.payOrder.deleteMany({ where: { merchantOrderId: { startsWith: 'TESTORD' } } });
        console.log('Cleanup completed successfully.');
        console.log('\n🎉 --- ALL PAYMENT MODULE E2E CHECKS PASSED SUCCESSFULLY! ---');
    }
    catch (err) {
        console.error('\n❌ E2E Integration Checks Failed:', err);
        process.exit(1);
    }
    finally {
        await app.close();
    }
}
main();
//# sourceMappingURL=verify-pay.js.map