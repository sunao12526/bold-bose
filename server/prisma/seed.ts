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

  console.log('Menus seeded.');

  // 3. Link all Menus to super_admin role
  const allMenus = [
    sysDir, userMenu, roleMenu, menuMenu, userCreate, userUpdate, userDelete,
    dictMenu, configMenu, infraDir, fileConfigMenu, fileListMenu, logMenu
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

  console.log('System configs seeded.');
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
