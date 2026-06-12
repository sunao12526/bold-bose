"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    const superAdminRole = await prisma.role.upsert({
        where: { code: 'super_admin' },
        update: {},
        create: {
            name: '超级管理员',
            code: 'super_admin',
            sort: 1,
            status: client_1.CommonStatus.ENABLE,
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
            status: client_1.CommonStatus.ENABLE,
            remark: '普通管理员，部分系统管理权限',
        },
    });
    console.log('Roles seeded.');
    await prisma.menu.deleteMany({});
    const sysDir = await prisma.menu.create({
        data: {
            name: '系统管理',
            type: client_1.MenuType.DIR,
            path: '/system',
            icon: 'SettingOutlined',
            sort: 1,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const userMenu = await prisma.menu.create({
        data: {
            name: '用户管理',
            type: client_1.MenuType.MENU,
            parentId: sysDir.id,
            path: '/system/user',
            icon: 'UserOutlined',
            permission: 'system:user:query',
            component: 'system/user/index',
            sort: 1,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const roleMenu = await prisma.menu.create({
        data: {
            name: '角色管理',
            type: client_1.MenuType.MENU,
            parentId: sysDir.id,
            path: '/system/role',
            icon: 'TeamOutlined',
            permission: 'system:role:query',
            component: 'system/role/index',
            sort: 2,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const menuMenu = await prisma.menu.create({
        data: {
            name: '菜单管理',
            type: client_1.MenuType.MENU,
            parentId: sysDir.id,
            path: '/system/menu',
            icon: 'MenuOutlined',
            permission: 'system:menu:query',
            component: 'system/menu/index',
            sort: 3,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const userCreate = await prisma.menu.create({
        data: { name: '用户新增', type: client_1.MenuType.BUTTON, parentId: userMenu.id, permission: 'system:user:create', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const userUpdate = await prisma.menu.create({
        data: { name: '用户修改', type: client_1.MenuType.BUTTON, parentId: userMenu.id, permission: 'system:user:update', sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    const userDelete = await prisma.menu.create({
        data: { name: '用户删除', type: client_1.MenuType.BUTTON, parentId: userMenu.id, permission: 'system:user:delete', sort: 3, status: client_1.CommonStatus.ENABLE },
    });
    const dictMenu = await prisma.menu.create({
        data: {
            name: '字典管理',
            type: client_1.MenuType.MENU,
            parentId: sysDir.id,
            path: '/system/dict',
            icon: 'BookOutlined',
            permission: 'system:dict:query',
            component: 'system/dict/index',
            sort: 4,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const configMenu = await prisma.menu.create({
        data: {
            name: '参数配置',
            type: client_1.MenuType.MENU,
            parentId: sysDir.id,
            path: '/system/config',
            icon: 'ControlOutlined',
            permission: 'system:config:query',
            component: 'system/config/index',
            sort: 5,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const infraDir = await prisma.menu.create({
        data: {
            name: '基础设施',
            type: client_1.MenuType.DIR,
            path: '/infra',
            icon: 'BuildOutlined',
            sort: 2,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const fileConfigMenu = await prisma.menu.create({
        data: {
            name: '文件配置',
            type: client_1.MenuType.MENU,
            parentId: infraDir.id,
            path: '/infra/file-config',
            icon: 'ToolOutlined',
            permission: 'infra:file-config:query',
            component: 'infra/file-config/index',
            sort: 1,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const fileListMenu = await prisma.menu.create({
        data: {
            name: '文件列表',
            type: client_1.MenuType.MENU,
            parentId: infraDir.id,
            path: '/infra/file',
            icon: 'FileOutlined',
            permission: 'infra:file:query',
            component: 'infra/file/index',
            sort: 2,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const logMenu = await prisma.menu.create({
        data: {
            name: '系统日志',
            type: client_1.MenuType.MENU,
            parentId: infraDir.id,
            path: '/infra/log',
            icon: 'FileTextOutlined',
            permission: 'infra:log:query',
            component: 'infra/log/index',
            sort: 3,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    console.log('Menus seeded.');
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
            status: client_1.CommonStatus.ENABLE,
            remark: '系统内置超级管理员账号',
        },
    });
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
    await prisma.fileConfig.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: '本地存储',
            storage: client_1.FileStorageType.LOCAL,
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
            storage: client_1.FileStorageType.S3,
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
    const dictCommonStatus = await prisma.dictType.upsert({
        where: { type: 'sys_common_status' },
        update: {},
        create: {
            name: '系统状态',
            type: 'sys_common_status',
            status: client_1.CommonStatus.ENABLE,
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
            status: client_1.CommonStatus.ENABLE,
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
            status: client_1.CommonStatus.ENABLE,
            colorType: 'danger',
            remark: '系统禁用',
        },
    });
    console.log('Data dictionaries seeded.');
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
//# sourceMappingURL=seed.js.map