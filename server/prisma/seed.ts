import { PrismaClient, MenuType, CommonStatus, FileStorageType, MallOrderStatus, MallRefundStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Roles
  const superAdminRole = await prisma.role.upsert({
    where: { code: 'super_admin' },
    update: {},
    create: {
      name: '超级管理员',
      code: 'super_admin',
      sort: 1,
      status: CommonStatus.ENABLE,
      remark: '系统最高权限管理员',
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { code: 'admin' },
    update: {},
    create: {
      name: '普通管理员',
      code: 'admin',
      sort: 2,
      status: CommonStatus.ENABLE,
      remark: '普通管理员，部分系统管理权限',
    },
  });

  console.log('Roles seeded.');

  // 2. Create Menus
  await prisma.menu.deleteMany({});

  // System Directory
  const sysDir = await prisma.menu.create({
    data: {
      name: '系统管理',
      type: MenuType.DIR,
      path: '/system',
      icon: 'SettingOutlined',
      sort: 1,
      status: CommonStatus.ENABLE,
    },
  });

  // User Menu
  const userMenu = await prisma.menu.create({
    data: {
      name: '用户管理',
      type: MenuType.MENU,
      parentId: sysDir.id,
      path: '/system/user',
      icon: 'UserOutlined',
      permission: 'system:user:query',
      component: 'system/user/index',
      sort: 1,
      status: CommonStatus.ENABLE,
    },
  });

  // Role Menu
  const roleMenu = await prisma.menu.create({
    data: {
      name: '角色管理',
      type: MenuType.MENU,
      parentId: sysDir.id,
      path: '/system/role',
      icon: 'TeamOutlined',
      permission: 'system:role:query',
      component: 'system/role/index',
      sort: 2,
      status: CommonStatus.ENABLE,
    },
  });

  // Menu Menu
  const menuMenu = await prisma.menu.create({
    data: {
      name: '菜单管理',
      type: MenuType.MENU,
      parentId: sysDir.id,
      path: '/system/menu',
      icon: 'MenuOutlined',
      permission: 'system:menu:query',
      component: 'system/menu/index',
      sort: 3,
      status: CommonStatus.ENABLE,
    },
  });

  // Buttons/Permissions
  const userCreate = await prisma.menu.create({
    data: { name: '用户新增', type: MenuType.BUTTON, parentId: userMenu.id, permission: 'system:user:create', sort: 1, status: CommonStatus.ENABLE },
  });
  const userUpdate = await prisma.menu.create({
    data: { name: '用户修改', type: MenuType.BUTTON, parentId: userMenu.id, permission: 'system:user:update', sort: 2, status: CommonStatus.ENABLE },
  });
  const userDelete = await prisma.menu.create({
    data: { name: '用户删除', type: MenuType.BUTTON, parentId: userMenu.id, permission: 'system:user:delete', sort: 3, status: CommonStatus.ENABLE },
  });

  // Phase 2 Menus: Dict, Config, File Config, File History
  const dictMenu = await prisma.menu.create({
    data: {
      name: '字典管理',
      type: MenuType.MENU,
      parentId: sysDir.id,
      path: '/system/dict',
      icon: 'BookOutlined',
      permission: 'system:dict:query',
      component: 'system/dict/index',
      sort: 4,
      status: CommonStatus.ENABLE,
    },
  });

  const configMenu = await prisma.menu.create({
    data: {
      name: '参数配置',
      type: MenuType.MENU,
      parentId: sysDir.id,
      path: '/system/config',
      icon: 'ControlOutlined',
      permission: 'system:config:query',
      component: 'system/config/index',
      sort: 5,
      status: CommonStatus.ENABLE,
    },
  });

  // Infra Directory (Infrastructure)
  const infraDir = await prisma.menu.create({
    data: {
      name: '基础设施',
      type: MenuType.DIR,
      path: '/infra',
      icon: 'BuildOutlined',
      sort: 2,
      status: CommonStatus.ENABLE,
    },
  });

  const fileConfigMenu = await prisma.menu.create({
    data: {
      name: '文件配置',
      type: MenuType.MENU,
      parentId: infraDir.id,
      path: '/infra/file-config',
      icon: 'ToolOutlined',
      permission: 'infra:file-config:query',
      component: 'infra/file-config/index',
      sort: 1,
      status: CommonStatus.ENABLE,
    },
  });

  const fileListMenu = await prisma.menu.create({
    data: {
      name: '文件列表',
      type: MenuType.MENU,
      parentId: infraDir.id,
      path: '/infra/file',
      icon: 'FileOutlined',
      permission: 'infra:file:query',
      component: 'infra/file/index',
      sort: 2,
      status: CommonStatus.ENABLE,
    },
  });

  const logMenu = await prisma.menu.create({
    data: {
      name: '系统日志',
      type: MenuType.MENU,
      parentId: infraDir.id,
      path: '/infra/log',
      icon: 'FileTextOutlined',
      permission: 'infra:log:query',
      component: 'infra/log/index',
      sort: 3,
      status: CommonStatus.ENABLE,
    },
  });

  const codegenMenu = await prisma.menu.create({
    data: {
      name: '代码生成',
      type: MenuType.MENU,
      parentId: infraDir.id,
      path: '/infra/codegen',
      icon: 'CodeOutlined',
      permission: 'infra:codegen:query',
      component: 'infra/codegen/index',
      sort: 4,
      status: CommonStatus.ENABLE,
    },
  });

  const jobMenu = await prisma.menu.create({
    data: {
      name: '定时任务',
      type: MenuType.MENU,
      parentId: infraDir.id,
      path: '/infra/job',
      icon: 'ScheduleOutlined',
      permission: 'infra:job:query',
      component: 'infra/job/index',
      sort: 5,
      status: CommonStatus.ENABLE,
    },
  });

  const notifyTemplateMenu = await prisma.menu.create({
    data: {
      name: '通知模板',
      type: MenuType.MENU,
      parentId: sysDir.id,
      path: '/system/notify-template',
      icon: 'MailOutlined',
      permission: 'system:notify-template:query',
      component: 'system/notify-template/index',
      sort: 6,
      status: CommonStatus.ENABLE,
    },
  });

  const notifyTemplateCreate = await prisma.menu.create({
    data: { name: '模板新增', type: MenuType.BUTTON, parentId: notifyTemplateMenu.id, permission: 'system:notify-template:create', sort: 1, status: CommonStatus.ENABLE },
  });
  const notifyTemplateUpdate = await prisma.menu.create({
    data: { name: '模板修改', type: MenuType.BUTTON, parentId: notifyTemplateMenu.id, permission: 'system:notify-template:update', sort: 2, status: CommonStatus.ENABLE },
  });
  const notifyTemplateDelete = await prisma.menu.create({
    data: { name: '模板删除', type: MenuType.BUTTON, parentId: notifyTemplateMenu.id, permission: 'system:notify-template:delete', sort: 3, status: CommonStatus.ENABLE },
  });

  const userSessionMenu = await prisma.menu.create({
    data: {
      name: '在线用户',
      type: MenuType.MENU,
      parentId: sysDir.id,
      path: '/system/user-session',
      icon: 'MonitorOutlined',
      permission: 'system:user-session:query',
      component: 'system/user-session/index',
      sort: 7,
      status: CommonStatus.ENABLE,
    },
  });

  const userSessionDelete = await prisma.menu.create({
    data: { name: '会话强退', type: MenuType.BUTTON, parentId: userSessionMenu.id, permission: 'system:user-session:delete', sort: 1, status: CommonStatus.ENABLE },
  });

  // Mall Directory
  const mallDir = await prisma.menu.create({
    data: {
      name: '商城管理',
      type: MenuType.DIR,
      path: '/mall',
      icon: 'ShopOutlined',
      sort: 3,
      status: CommonStatus.ENABLE,
    },
  });

  // Category Menu
  const mallCategoryMenu = await prisma.menu.create({
    data: {
      name: '商品分类',
      type: MenuType.MENU,
      parentId: mallDir.id,
      path: '/mall/category',
      icon: 'AppstoreOutlined',
      permission: 'mall:category:query',
      component: 'mall/category/index',
      sort: 1,
      status: CommonStatus.ENABLE,
    },
  });
  const mallCategoryCreate = await prisma.menu.create({
    data: { name: '分类新增', type: MenuType.BUTTON, parentId: mallCategoryMenu.id, permission: 'mall:category:create', sort: 1, status: CommonStatus.ENABLE },
  });
  const mallCategoryUpdate = await prisma.menu.create({
    data: { name: '分类修改', type: MenuType.BUTTON, parentId: mallCategoryMenu.id, permission: 'mall:category:update', sort: 2, status: CommonStatus.ENABLE },
  });
  const mallCategoryDelete = await prisma.menu.create({
    data: { name: '分类删除', type: MenuType.BUTTON, parentId: mallCategoryMenu.id, permission: 'mall:category:delete', sort: 3, status: CommonStatus.ENABLE },
  });

  // Brand Menu
  const mallBrandMenu = await prisma.menu.create({
    data: {
      name: '商品品牌',
      type: MenuType.MENU,
      parentId: mallDir.id,
      path: '/mall/brand',
      icon: 'CopyrightOutlined',
      permission: 'mall:brand:query',
      component: 'mall/brand/index',
      sort: 2,
      status: CommonStatus.ENABLE,
    },
  });
  const mallBrandCreate = await prisma.menu.create({
    data: { name: '品牌新增', type: MenuType.BUTTON, parentId: mallBrandMenu.id, permission: 'mall:brand:create', sort: 1, status: CommonStatus.ENABLE },
  });
  const mallBrandUpdate = await prisma.menu.create({
    data: { name: '品牌修改', type: MenuType.BUTTON, parentId: mallBrandMenu.id, permission: 'mall:brand:update', sort: 2, status: CommonStatus.ENABLE },
  });
  const mallBrandDelete = await prisma.menu.create({
    data: { name: '品牌删除', type: MenuType.BUTTON, parentId: mallBrandMenu.id, permission: 'mall:brand:delete', sort: 3, status: CommonStatus.ENABLE },
  });

  // Property Menu
  const mallPropertyMenu = await prisma.menu.create({
    data: {
      name: '规格管理',
      type: MenuType.MENU,
      parentId: mallDir.id,
      path: '/mall/property',
      icon: 'TagsOutlined',
      permission: 'mall:property:query',
      component: 'mall/property/index',
      sort: 3,
      status: CommonStatus.ENABLE,
    },
  });
  const mallPropertyCreate = await prisma.menu.create({
    data: { name: '规格新增', type: MenuType.BUTTON, parentId: mallPropertyMenu.id, permission: 'mall:property:create', sort: 1, status: CommonStatus.ENABLE },
  });
  const mallPropertyUpdate = await prisma.menu.create({
    data: { name: '规格修改', type: MenuType.BUTTON, parentId: mallPropertyMenu.id, permission: 'mall:property:update', sort: 2, status: CommonStatus.ENABLE },
  });
  const mallPropertyDelete = await prisma.menu.create({
    data: { name: '规格删除', type: MenuType.BUTTON, parentId: mallPropertyMenu.id, permission: 'mall:property:delete', sort: 3, status: CommonStatus.ENABLE },
  });

  // SPU Menu
  const mallSpuMenu = await prisma.menu.create({
    data: {
      name: '商品列表',
      type: MenuType.MENU,
      parentId: mallDir.id,
      path: '/mall/spu',
      icon: 'ShoppingOutlined',
      permission: 'mall:spu:query',
      component: 'mall/spu/index',
      sort: 4,
      status: CommonStatus.ENABLE,
    },
  });
  const mallSpuCreate = await prisma.menu.create({
    data: { name: '商品新增', type: MenuType.BUTTON, parentId: mallSpuMenu.id, permission: 'mall:spu:create', sort: 1, status: CommonStatus.ENABLE },
  });
  const mallSpuUpdate = await prisma.menu.create({
    data: { name: '商品修改', type: MenuType.BUTTON, parentId: mallSpuMenu.id, permission: 'mall:spu:update', sort: 2, status: CommonStatus.ENABLE },
  });
  const mallSpuDelete = await prisma.menu.create({
    data: { name: '商品删除', type: MenuType.BUTTON, parentId: mallSpuMenu.id, permission: 'mall:spu:delete', sort: 3, status: CommonStatus.ENABLE },
  });

  // Member Directory (Top-Level)
  const memberDir = await prisma.menu.create({
    data: {
      name: '会员管理',
      type: MenuType.DIR,
      path: '/member',
      icon: 'UserOutlined',
      sort: 4,
      status: CommonStatus.ENABLE,
    },
  });

  // Member User Menu
  const memberUserMenu = await prisma.menu.create({
    data: {
      name: '会员列表',
      type: MenuType.MENU,
      parentId: memberDir.id,
      path: '/member/user',
      icon: 'UserOutlined',
      permission: 'member:user:query',
      component: 'member/user/index',
      sort: 1,
      status: CommonStatus.ENABLE,
    },
  });
  const memberUserUpdate = await prisma.menu.create({
    data: { name: '会员修改', type: MenuType.BUTTON, parentId: memberUserMenu.id, permission: 'member:user:update', sort: 1, status: CommonStatus.ENABLE },
  });

  // Member Level Menu
  const memberLevelMenu = await prisma.menu.create({
    data: {
      name: '会员等级',
      type: MenuType.MENU,
      parentId: memberDir.id,
      path: '/member/level',
      icon: 'TrophyOutlined',
      permission: 'member:level:query',
      component: 'member/level/index',
      sort: 2,
      status: CommonStatus.ENABLE,
    },
  });
  const memberLevelCreate = await prisma.menu.create({
    data: { name: '等级新增', type: MenuType.BUTTON, parentId: memberLevelMenu.id, permission: 'member:level:create', sort: 1, status: CommonStatus.ENABLE },
  });
  const memberLevelUpdate = await prisma.menu.create({
    data: { name: '等级修改', type: MenuType.BUTTON, parentId: memberLevelMenu.id, permission: 'member:level:update', sort: 2, status: CommonStatus.ENABLE },
  });
  const memberLevelDelete = await prisma.menu.create({
    data: { name: '等级删除', type: MenuType.BUTTON, parentId: memberLevelMenu.id, permission: 'member:level:delete', sort: 3, status: CommonStatus.ENABLE },
  });

  // Member Tag Menu
  const memberTagMenu = await prisma.menu.create({
    data: {
      name: '会员标签',
      type: MenuType.MENU,
      parentId: memberDir.id,
      path: '/member/tag',
      icon: 'TagsOutlined',
      permission: 'member:tag:query',
      component: 'member/tag/index',
      sort: 3,
      status: CommonStatus.ENABLE,
    },
  });
  const memberTagCreate = await prisma.menu.create({
    data: { name: '标签新增', type: MenuType.BUTTON, parentId: memberTagMenu.id, permission: 'member:tag:create', sort: 1, status: CommonStatus.ENABLE },
  });
  const memberTagUpdate = await prisma.menu.create({
    data: { name: '标签修改', type: MenuType.BUTTON, parentId: memberTagMenu.id, permission: 'member:tag:update', sort: 2, status: CommonStatus.ENABLE },
  });
  const memberTagDelete = await prisma.menu.create({
    data: { name: '标签删除', type: MenuType.BUTTON, parentId: memberTagMenu.id, permission: 'member:tag:delete', sort: 3, status: CommonStatus.ENABLE },
  });

  // Member Sign-in Config Menu
  const memberSignInConfigMenu = await prisma.menu.create({
    data: {
      name: '签到规则',
      type: MenuType.MENU,
      parentId: memberDir.id,
      path: '/member/sign-in-config',
      icon: 'ScheduleOutlined',
      permission: 'member:sign-in-config:query',
      component: 'member/sign-in-config/index',
      sort: 4,
      status: CommonStatus.ENABLE,
    },
  });
  const memberSignInConfigUpdate = await prisma.menu.create({
    data: { name: '规则修改', type: MenuType.BUTTON, parentId: memberSignInConfigMenu.id, permission: 'member:sign-in-config:update', sort: 1, status: CommonStatus.ENABLE },
  });

  // Member Sign-in Record Menu
  const memberSignInRecordMenu = await prisma.menu.create({
    data: {
      name: '签到记录',
      type: MenuType.MENU,
      parentId: memberDir.id,
      path: '/member/sign-in-record',
      icon: 'HistoryOutlined',
      permission: 'member:sign-in-record:query',
      component: 'member/sign-in-record/index',
      sort: 5,
      status: CommonStatus.ENABLE,
    },
  });

  // Order Menu
  const mallOrderMenu = await prisma.menu.create({
    data: {
      name: '订单管理',
      type: MenuType.MENU,
      parentId: mallDir.id,
      path: '/mall/order',
      icon: 'FileTextOutlined',
      permission: 'mall:order:query',
      component: 'mall/order/index',
      sort: 6,
      status: CommonStatus.ENABLE,
    },
  });
  const mallOrderUpdate = await prisma.menu.create({
    data: { name: '订单修改', type: MenuType.BUTTON, parentId: mallOrderMenu.id, permission: 'mall:order:update', sort: 1, status: CommonStatus.ENABLE },
  });

  // Refund Menu
  const mallRefundMenu = await prisma.menu.create({
    data: {
      name: '退款售后',
      type: MenuType.MENU,
      parentId: mallDir.id,
      path: '/mall/order-refund',
      icon: 'ReloadOutlined',
      permission: 'mall:refund:query',
      component: 'mall/order-refund/index',
      sort: 7,
      status: CommonStatus.ENABLE,
    },
  });
  const mallRefundUpdate = await prisma.menu.create({
    data: { name: '售后审批', type: MenuType.BUTTON, parentId: mallRefundMenu.id, permission: 'mall:refund:update', sort: 1, status: CommonStatus.ENABLE },
  });

  // Coupon Menu
  const mallCouponMenu = await prisma.menu.create({
    data: {
      name: '优惠券管理',
      type: MenuType.MENU,
      parentId: mallDir.id,
      path: '/mall/coupon',
      icon: 'GiftOutlined',
      permission: 'mall:coupon:query',
      component: 'mall/coupon/index',
      sort: 8,
      status: CommonStatus.ENABLE,
    },
  });
  const mallCouponCreate = await prisma.menu.create({
    data: { name: '优惠券新增', type: MenuType.BUTTON, parentId: mallCouponMenu.id, permission: 'mall:coupon:create', sort: 1, status: CommonStatus.ENABLE },
  });
  const mallCouponUpdate = await prisma.menu.create({
    data: { name: '优惠券修改', type: MenuType.BUTTON, parentId: mallCouponMenu.id, permission: 'mall:coupon:update', sort: 2, status: CommonStatus.ENABLE },
  });
  const mallCouponDelete = await prisma.menu.create({
    data: { name: '优惠券删除', type: MenuType.BUTTON, parentId: mallCouponMenu.id, permission: 'mall:coupon:delete', sort: 3, status: CommonStatus.ENABLE },
  });

  console.log('Menus seeded.');

  // 3. Link all Menus to super_admin role
  const allMenus = [
    sysDir, userMenu, roleMenu, menuMenu, userCreate, userUpdate, userDelete,
    dictMenu, configMenu, infraDir, fileConfigMenu, fileListMenu, logMenu, codegenMenu, jobMenu,
    notifyTemplateMenu, notifyTemplateCreate, notifyTemplateUpdate, notifyTemplateDelete,
    userSessionMenu, userSessionDelete,
    mallDir, mallCategoryMenu, mallCategoryCreate, mallCategoryUpdate, mallCategoryDelete,
    mallBrandMenu, mallBrandCreate, mallBrandUpdate, mallBrandDelete,
    mallPropertyMenu, mallPropertyCreate, mallPropertyUpdate, mallPropertyDelete,
    mallSpuMenu, mallSpuCreate, mallSpuUpdate, mallSpuDelete,
    mallOrderMenu, mallOrderUpdate,
    mallRefundMenu, mallRefundUpdate,
    mallCouponMenu, mallCouponCreate, mallCouponUpdate, mallCouponDelete,
    memberDir, memberUserMenu, memberUserUpdate,
    memberLevelMenu, memberLevelCreate, memberLevelUpdate, memberLevelDelete,
    memberTagMenu, memberTagCreate, memberTagUpdate, memberTagDelete,
    memberSignInConfigMenu, memberSignInConfigUpdate, memberSignInRecordMenu
  ];
  for (const menu of allMenus) {
    await prisma.roleMenu.upsert({
      where: {
        roleId_menuId: {
          roleId: superAdminRole.id,
          menuId: menu.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        menuId: menu.id,
      },
    });
  }

  // 4. Create User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      nickname: '超级管理员',
      email: 'admin@yudao.local',
      mobile: '18888888888',
      status: CommonStatus.ENABLE,
      remark: '系统内置超级管理员账号',
    },
  });

  // 5. Link User to super_admin Role
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: superAdminRole.id,
    },
  });

  // 6. Seed default File Storage Configs
  await prisma.fileConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: '本地存储',
      storage: FileStorageType.LOCAL,
      master: true,
      config: { baseFolder: './uploads' },
      remark: '本地磁盘文件存储',
    },
  });

  await prisma.fileConfig.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'SeaweedFS存储',
      storage: FileStorageType.S3,
      master: false,
      config: {
        endpoint: 'http://localhost:8333',
        bucket: 'bold-bose',
        accessKey: 'any',
        secretKey: 'any',
        domain: 'http://localhost:8333/bold-bose'
      },
      remark: '本地 SeaweedFS 兼容 S3 存储',
    },
  });

  console.log('File configs seeded.');

  // 7. Seed Data Dictionaries (DictTypes & DictData)
  const dictCommonStatus = await prisma.dictType.upsert({
    where: { type: 'sys_common_status' },
    update: {},
    create: {
      name: '系统状态',
      type: 'sys_common_status',
      status: CommonStatus.ENABLE,
      remark: '系统启用/禁用状态字典',
    },
  });

  await prisma.dictData.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      dictType: dictCommonStatus.type,
      label: '启用',
      value: 'ENABLE',
      sort: 1,
      status: CommonStatus.ENABLE,
      colorType: 'success',
      remark: '系统启用',
    },
  });

  await prisma.dictData.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      dictType: dictCommonStatus.type,
      label: '禁用',
      value: 'DISABLE',
      sort: 2,
      status: CommonStatus.ENABLE,
      colorType: 'danger',
      remark: '系统禁用',
    },
  });

  console.log('Data dictionaries seeded.');

  // 8. Seed Default System Configs
  await prisma.sysConfig.upsert({
    where: { key: 'sys.title' },
    update: {},
    create: {
      name: '系统标题',
      key: 'sys.title',
      value: '芋道云管理系统',
      visible: true,
      remark: '后台系统主页标题显示',
    },
  });

  await prisma.sysConfig.upsert({
    where: { key: 'sys.logo' },
    update: {},
    create: {
      name: '系统 Logo',
      key: 'sys.logo',
      value: '/logo.png',
      visible: true,
      remark: '后台系统登录及主页左上角显示',
    },
  });

  // Seed default SMTP Mail configurations
  await prisma.sysConfig.upsert({
    where: { key: 'sys.mail.host' },
    update: {},
    create: {
      name: 'SMTP 邮件服务器地址',
      key: 'sys.mail.host',
      value: 'smtp.mailtrap.io',
      visible: true,
      remark: 'SMTP邮件服务器主机，例如 smtp.qq.com',
    },
  });

  await prisma.sysConfig.upsert({
    where: { key: 'sys.mail.port' },
    update: {},
    create: {
      name: 'SMTP 邮件服务器端口',
      key: 'sys.mail.port',
      value: '2525',
      visible: true,
      remark: 'SMTP邮件服务器端口，通常为 25, 465, 587 或 2525',
    },
  });

  await prisma.sysConfig.upsert({
    where: { key: 'sys.mail.username' },
    update: {},
    create: {
      name: 'SMTP 邮件用户名',
      key: 'sys.mail.username',
      value: 'any',
      visible: true,
      remark: 'SMTP邮件账户用户名',
    },
  });

  await prisma.sysConfig.upsert({
    where: { key: 'sys.mail.password' },
    update: {},
    create: {
      name: 'SMTP 邮件密码',
      key: 'sys.mail.password',
      value: 'any',
      visible: true,
      remark: 'SMTP邮件账户密码或授权码',
    },
  });

  await prisma.sysConfig.upsert({
    where: { key: 'sys.mail.ssl' },
    update: {},
    create: {
      name: 'SMTP 邮件启用 SSL',
      key: 'sys.mail.ssl',
      value: 'false',
      visible: true,
      remark: '是否启用安全连接 SSL/TLS (true 或 false)',
    },
  });

  await prisma.sysConfig.upsert({
    where: { key: 'sys.mail.from' },
    update: {},
    create: {
      name: 'SMTP 邮件发件人地址',
      key: 'sys.mail.from',
      value: 'system@yudao.local',
      visible: true,
      remark: '发件人邮箱，例如 mail@yudao.local',
    },
  });

  console.log('System configs seeded.');

  // Seed default Notification Templates
  await prisma.notifyTemplate.upsert({
    where: { code: 'user_welcome' },
    update: {},
    create: {
      name: '用户注册欢迎模版',
      code: 'user_welcome',
      type: 'SYSTEM',
      title: '欢迎注册系统',
      content: '你好，{nickname}！欢迎注册 {systemName}！您的账号是 {username}。',
      status: CommonStatus.ENABLE,
      remark: '新用户注册成功后的站内欢迎信',
    },
  });

  await prisma.notifyTemplate.upsert({
    where: { code: 'test_email' },
    update: {},
    create: {
      name: '测试邮件模版',
      code: 'test_email',
      type: 'EMAIL',
      title: '测试通知邮件',
      content: '你好，{nickname}！这是一封测试通知邮件，用于验证邮件服务器连接。发送时间为：{time}。',
      status: CommonStatus.ENABLE,
      remark: '用于系统后台邮件测试',
    },
  });

  console.log('Notification templates seeded.');

  // 9. Seed default background jobs
  await prisma.sysJob.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: '操作审计日志清理',
      handlerName: 'logCleanupJob',
      cronExpression: '0 0 2 * * *',
      status: CommonStatus.DISABLE,
      remark: '每日凌晨2点自动清理7天前的系统操作审计日志',
    },
  });

  await prisma.sysJob.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: '系统状态健康监测',
      handlerName: 'demoTaskJob',
      cronExpression: '*/5 * * * * *',
      status: CommonStatus.DISABLE,
      remark: '每5秒触发一次的测试定时任务，在控制台输出 hello 消息',
    },
  });

  await prisma.sysJob.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: '在线会话清理',
      handlerName: 'sessionCleanupJob',
      cronExpression: '0 0 3 * * *',
      status: CommonStatus.ENABLE,
      remark: '每日凌晨3点自动清理过期的用户登录会话',
    },
  });

  console.log('Background jobs seeded.');

  // 10. Seed E-commerce Mall sample data
  console.log('Seeding E-commerce Mall sample data...');
  
  // Categories
  const catDigital = await prisma.mallCategory.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: '手机数码',
      parentId: null,
      picUrl: '/category/digital.png',
      sort: 1,
      status: CommonStatus.ENABLE,
    },
  });

  const catPhone = await prisma.mallCategory.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: '智能手机',
      parentId: catDigital.id,
      picUrl: '/category/phone.png',
      sort: 1,
      status: CommonStatus.ENABLE,
    },
  });

  // Brands
  const brandApple = await prisma.mallBrand.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: '苹果 (Apple)',
      logo: '/brand/apple.png',
      sort: 1,
      status: CommonStatus.ENABLE,
    },
  });

  const brandHuawei = await prisma.mallBrand.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: '华为 (Huawei)',
      logo: '/brand/huawei.png',
      sort: 2,
      status: CommonStatus.ENABLE,
    },
  });

  // Properties & Values
  const propColor = await prisma.mallProperty.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: '颜色',
    },
  });

  const valBlack = await prisma.mallPropertyValue.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      propertyId: propColor.id,
      value: '黑色',
    },
  });

  const valWhite = await prisma.mallPropertyValue.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      propertyId: propColor.id,
      value: '白色',
    },
  });

  const propStorage = await prisma.mallProperty.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: '内存存储',
    },
  });

  const val256 = await prisma.mallPropertyValue.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      propertyId: propStorage.id,
      value: '256GB',
    },
  });

  // Product SPU & SKU
  await prisma.mallSpu.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: '华为 Mate 60 Pro',
      categoryId: catPhone.id,
      brandId: brandHuawei.id,
      picUrl: '/spu/mate60.png',
      sliderPicUrls: ['/spu/mate60_1.png', '/spu/mate60_2.png'],
      description: '华为 Mate 60 Pro 搭载超可靠玄武架构，强悍性能与非凡体验。',
      sort: 1,
      status: CommonStatus.ENABLE,
      minPrice: 699900,
      maxPrice: 699900,
      totalStock: 250,
      skus: {
        create: [
          {
            properties: [
              { propertyId: propColor.id, propertyName: '颜色', valueId: valBlack.id, valueName: '黑色' },
              { propertyId: propStorage.id, propertyName: '内存存储', valueId: val256.id, valueName: '256GB' }
            ],
            price: 699900,
            marketPrice: 799900,
            costPrice: 500000,
            stock: 100,
            picUrl: '/spu/mate60_black.png',
            barCode: 'HW-M60P-BLK-256'
          },
          {
            properties: [
              { propertyId: propColor.id, propertyName: '颜色', valueId: valWhite.id, valueName: '白色' },
              { propertyId: propStorage.id, propertyName: '内存存储', valueId: val256.id, valueName: '256GB' }
            ],
            price: 699900,
            marketPrice: 799900,
            costPrice: 500000,
            stock: 150,
            picUrl: '/spu/mate60_white.png',
            barCode: 'HW-M60P-WHT-256'
          }
        ]
      }
    }
  });

  console.log('E-commerce Mall sample data seeded.');

  // 11. Seed Member Users, Orders, and Refunds
  console.log('Seeding Member users, Orders, and Refunds...');
  
  // Clean up
  await prisma.memberSignInRecord.deleteMany({});
  await prisma.memberSignInConfig.deleteMany({});
  await prisma.memberTag.deleteMany({});
  await prisma.mallOrderRefund.deleteMany({});
  await prisma.mallOrderItem.deleteMany({});
  await prisma.mallOrder.deleteMany({});
  await prisma.memberUser.deleteMany({});
  await prisma.memberLevel.deleteMany({});

  // Seed Member Levels
  const lvlBronze = await prisma.memberLevel.create({
    data: { name: '青铜会员', level: 1, experience: 0, discountPercent: 100 }
  });
  const lvlSilver = await prisma.memberLevel.create({
    data: { name: '白银会员', level: 2, experience: 1000, discountPercent: 95 }
  });
  const lvlGold = await prisma.memberLevel.create({
    data: { name: '黄金会员', level: 3, experience: 5000, discountPercent: 90 }
  });

  // Seed Member Tags
  const tagHighSpender = await prisma.memberTag.create({
    data: { name: '高客单价', description: '历史累计消费金额较高的会员客户' }
  });
  const tagSleepy = await prisma.memberTag.create({
    data: { name: '沉睡会员', description: '超过30天未活跃登录的会员' }
  });

  // Seed Sign-in Configs (1 to 7 days)
  const configs = [
    { day: 1, point: 10 },
    { day: 2, point: 20 },
    { day: 3, point: 30 },
    { day: 4, point: 40 },
    { day: 5, point: 50 },
    { day: 6, point: 60 },
    { day: 7, point: 100 }
  ];
  for (const conf of configs) {
    await prisma.memberSignInConfig.create({ data: conf });
  }

  // Create Members
  const member1 = await prisma.memberUser.upsert({
    where: { mobile: '13800138000' },
    update: {},
    create: {
      nickname: '张三',
      mobile: '13800138000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80',
      points: 1000,
      balance: 500000, // 5000.00元
      experience: 1500,
      levelId: lvlSilver.id,
      tagIds: [tagHighSpender.id],
      status: CommonStatus.ENABLE,
    },
  });

  const member2 = await prisma.memberUser.upsert({
    where: { mobile: '13900139000' },
    update: {},
    create: {
      nickname: '李四',
      mobile: '13900139000',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80',
      points: 500,
      balance: 200000, // 2000.00元
      experience: 0,
      levelId: lvlBronze.id,
      tagIds: [tagSleepy.id],
      status: CommonStatus.DISABLE,
    },
  });

  // Seed Check-in Records
  await prisma.memberSignInRecord.create({
    data: {
      memberId: member1.id,
      day: 1,
      point: 10,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
    }
  });

  await prisma.memberSignInRecord.create({
    data: {
      memberId: member1.id,
      day: 2,
      point: 20,
      createdAt: new Date() // Today
    }
  });

  // Find the SPU & SKU seeded above
  const spuPhone = await prisma.mallSpu.findFirst({
    where: { id: 1 },
    include: { skus: true },
  });

  if (spuPhone && spuPhone.skus.length >= 2) {
    const skuBlack = spuPhone.skus[0];
    const skuWhite = spuPhone.skus[1];

    // Order 1: UNPAID
    const order1 = await prisma.mallOrder.create({
      data: {
        no: 'ORD202606120001',
        memberId: member1.id,
        status: MallOrderStatus.UNPAID,
        totalPrice: 699900,
        payPrice: 699900,
        receiverName: '张三',
        receiverMobile: '13800138000',
        receiverAddress: '北京市朝阳区三里屯 SOHO A座',
        userRemark: '请尽快发货',
        items: {
          create: [
            {
              spuId: spuPhone.id,
              skuId: skuBlack.id,
              spuName: spuPhone.name,
              picUrl: skuBlack.picUrl || spuPhone.picUrl,
              properties: skuBlack.properties || [],
              price: skuBlack.price,
              count: 1,
            },
          ],
        },
      },
    });

    // Order 2: UNDELIVERED (PAID)
    const order2 = await prisma.mallOrder.create({
      data: {
        no: 'ORD202606120002',
        memberId: member1.id,
        status: MallOrderStatus.UNDELIVERED,
        totalPrice: 1399800,
        payPrice: 1399800,
        receiverName: '张三',
        receiverMobile: '13800138000',
        receiverAddress: '北京市朝阳区三里屯 SOHO A座',
        payTime: new Date(),
        items: {
          create: [
            {
              spuId: spuPhone.id,
              skuId: skuWhite.id,
              spuName: spuPhone.name,
              picUrl: skuWhite.picUrl || spuPhone.picUrl,
              properties: skuWhite.properties || [],
              price: skuWhite.price,
              count: 2,
            },
          ],
        },
      },
    });

    // Order 3: DELIVERED
    const order3 = await prisma.mallOrder.create({
      data: {
        no: 'ORD202606120003',
        memberId: member2.id,
        status: MallOrderStatus.DELIVERED,
        totalPrice: 699900,
        payPrice: 699900,
        receiverName: '李四',
        receiverMobile: '13900139000',
        receiverAddress: '上海市浦东新区张江高科技园区',
        payTime: new Date(),
        deliveryStatus: true,
        logisticsCo: '顺丰速运',
        logisticsNo: 'SF1234567890',
        deliveryTime: new Date(),
        items: {
          create: [
            {
              spuId: spuPhone.id,
              skuId: skuBlack.id,
              spuName: spuPhone.name,
              picUrl: skuBlack.picUrl || spuPhone.picUrl,
              properties: skuBlack.properties || [],
              price: skuBlack.price,
              count: 1,
            },
          ],
        },
      },
    });

    // Create Refund Request for Order 2
    await prisma.mallOrderRefund.create({
      data: {
        no: 'REF202606120001',
        orderId: order2.id,
        memberId: member1.id,
        refundPrice: 699900,
        status: MallRefundStatus.APPLY,
        reason: '商品买多了，申请退款一件',
        userRemark: '多买了一台，想退款',
      },
    });

    // Clean up coupons first
    await prisma.mallCouponUser.deleteMany({});
    await prisma.mallCoupon.deleteMany({});

    // Seed Coupon Templates
    const coupon1 = await prisma.mallCoupon.create({
      data: {
        name: '全场通用代金券',
        type: 'CASH',
        minPrice: 0,
        value: 10000, // 100.00元
        totalCount: 100,
        takeCount: 2,
        useCount: 1,
        scopeType: 'ALL',
        validityType: 'DATE',
        validStartTime: new Date(),
        validEndTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: CommonStatus.ENABLE,
      },
    });

    const coupon2 = await prisma.mallCoupon.create({
      data: {
        name: '数码折后券',
        type: 'DISCOUNT',
        minPrice: 20000, // 200.00元
        value: 85, // 8.5折 (85%)
        totalCount: 50,
        takeCount: 1,
        useCount: 1,
        scopeType: 'CATEGORY',
        scopeValue: [1], // catDigital.id
        validityType: 'TERM',
        validDays: 7,
        status: CommonStatus.ENABLE,
      },
    });

    const coupon3 = await prisma.mallCoupon.create({
      data: {
        name: 'Mate60专享券',
        type: 'CASH',
        minPrice: 600000, // 6000.00元
        value: 50000, // 500.00元
        totalCount: 200,
        takeCount: 0,
        useCount: 0,
        scopeType: 'SPU',
        scopeValue: [1], // SPU 1
        validityType: 'DATE',
        validStartTime: new Date(),
        validEndTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: CommonStatus.ENABLE,
      },
    });

    // Seed claimed User Coupons
    await prisma.mallCouponUser.create({
      data: {
        couponId: coupon1.id,
        memberId: member1.id,
        status: 'UNUSED',
        validStartTime: new Date(),
        validEndTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.mallCouponUser.create({
      data: {
        couponId: coupon1.id,
        memberId: member2.id,
        status: 'USED',
        useOrderId: order3.id,
        useTime: new Date(),
        validStartTime: new Date(),
        validEndTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.mallCouponUser.create({
      data: {
        couponId: coupon2.id,
        memberId: member1.id,
        status: 'USED',
        useOrderId: order2.id,
        useTime: new Date(),
        validStartTime: new Date(),
        validEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log('Member users, Orders, and Refunds seeded successfully.');
  console.log('Database seeding successfully finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
