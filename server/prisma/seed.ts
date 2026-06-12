import { PrismaClient, MenuType, CommonStatus, FileStorageType } from '@prisma/client';
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
    mallSpuMenu, mallSpuCreate, mallSpuUpdate, mallSpuDelete
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
