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
    const codegenMenu = await prisma.menu.create({
        data: {
            name: '代码生成',
            type: client_1.MenuType.MENU,
            parentId: infraDir.id,
            path: '/infra/codegen',
            icon: 'CodeOutlined',
            permission: 'infra:codegen:query',
            component: 'infra/codegen/index',
            sort: 4,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const jobMenu = await prisma.menu.create({
        data: {
            name: '定时任务',
            type: client_1.MenuType.MENU,
            parentId: infraDir.id,
            path: '/infra/job',
            icon: 'ScheduleOutlined',
            permission: 'infra:job:query',
            component: 'infra/job/index',
            sort: 5,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const notifyTemplateMenu = await prisma.menu.create({
        data: {
            name: '通知模板',
            type: client_1.MenuType.MENU,
            parentId: sysDir.id,
            path: '/system/notify-template',
            icon: 'MailOutlined',
            permission: 'system:notify-template:query',
            component: 'system/notify-template/index',
            sort: 6,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const notifyTemplateCreate = await prisma.menu.create({
        data: { name: '模板新增', type: client_1.MenuType.BUTTON, parentId: notifyTemplateMenu.id, permission: 'system:notify-template:create', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const notifyTemplateUpdate = await prisma.menu.create({
        data: { name: '模板修改', type: client_1.MenuType.BUTTON, parentId: notifyTemplateMenu.id, permission: 'system:notify-template:update', sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    const notifyTemplateDelete = await prisma.menu.create({
        data: { name: '模板删除', type: client_1.MenuType.BUTTON, parentId: notifyTemplateMenu.id, permission: 'system:notify-template:delete', sort: 3, status: client_1.CommonStatus.ENABLE },
    });
    const userSessionMenu = await prisma.menu.create({
        data: {
            name: '在线用户',
            type: client_1.MenuType.MENU,
            parentId: sysDir.id,
            path: '/system/user-session',
            icon: 'MonitorOutlined',
            permission: 'system:user-session:query',
            component: 'system/user-session/index',
            sort: 7,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const userSessionDelete = await prisma.menu.create({
        data: { name: '会话强退', type: client_1.MenuType.BUTTON, parentId: userSessionMenu.id, permission: 'system:user-session:delete', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const postMenu = await prisma.menu.create({
        data: {
            name: '岗位管理',
            type: client_1.MenuType.MENU,
            parentId: sysDir.id,
            path: '/system/posts',
            icon: 'SolutionOutlined',
            permission: 'system:posts:query',
            component: 'system/post/index',
            sort: 8,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const postCreate = await prisma.menu.create({
        data: { name: '岗位新增', type: client_1.MenuType.BUTTON, parentId: postMenu.id, permission: 'system:posts:create', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const postUpdate = await prisma.menu.create({
        data: { name: '岗位修改', type: client_1.MenuType.BUTTON, parentId: postMenu.id, permission: 'system:posts:update', sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    const postDelete = await prisma.menu.create({
        data: { name: '岗位删除', type: client_1.MenuType.BUTTON, parentId: postMenu.id, permission: 'system:posts:delete', sort: 3, status: client_1.CommonStatus.ENABLE },
    });
    const deptMenu = await prisma.menu.create({
        data: {
            name: '部门管理',
            type: client_1.MenuType.MENU,
            parentId: sysDir.id,
            path: '/system/dept',
            icon: 'PartitionOutlined',
            permission: 'system:dept:query',
            component: 'system/dept/index',
            sort: 9,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const deptCreate = await prisma.menu.create({
        data: { name: '部门新增', type: client_1.MenuType.BUTTON, parentId: deptMenu.id, permission: 'system:dept:create', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const deptUpdate = await prisma.menu.create({
        data: { name: '部门修改', type: client_1.MenuType.BUTTON, parentId: deptMenu.id, permission: 'system:dept:update', sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    const deptDelete = await prisma.menu.create({
        data: { name: '部门删除', type: client_1.MenuType.BUTTON, parentId: deptMenu.id, permission: 'system:dept:delete', sort: 3, status: client_1.CommonStatus.ENABLE },
    });
    const noticeMenu = await prisma.menu.create({
        data: {
            name: '通知公告',
            type: client_1.MenuType.MENU,
            parentId: sysDir.id,
            path: '/system/notice',
            icon: 'NotificationOutlined',
            permission: 'system:notice:query',
            component: 'system/notice/index',
            sort: 10,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const noticeCreate = await prisma.menu.create({
        data: { name: '公告新增', type: client_1.MenuType.BUTTON, parentId: noticeMenu.id, permission: 'system:notice:create', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const noticeUpdate = await prisma.menu.create({
        data: { name: '公告修改', type: client_1.MenuType.BUTTON, parentId: noticeMenu.id, permission: 'system:notice:update', sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    const noticeDelete = await prisma.menu.create({
        data: { name: '公告删除', type: client_1.MenuType.BUTTON, parentId: noticeMenu.id, permission: 'system:notice:delete', sort: 3, status: client_1.CommonStatus.ENABLE },
    });
    const smsDir = await prisma.menu.create({
        data: {
            name: '短信管理',
            type: client_1.MenuType.DIR,
            parentId: sysDir.id,
            path: '/system/sms',
            icon: 'MessageOutlined',
            sort: 11,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const smsChannelMenu = await prisma.menu.create({
        data: {
            name: '短信渠道',
            type: client_1.MenuType.MENU,
            parentId: smsDir.id,
            path: '/system/sms/channel',
            icon: 'PhoneOutlined',
            permission: 'system:sms:query',
            component: 'system/sms/channel',
            sort: 1,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const smsChannelCreate = await prisma.menu.create({
        data: { name: '渠道新增', type: client_1.MenuType.BUTTON, parentId: smsChannelMenu.id, permission: 'system:sms:create', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const smsChannelUpdate = await prisma.menu.create({
        data: { name: '渠道修改', type: client_1.MenuType.BUTTON, parentId: smsChannelMenu.id, permission: 'system:sms:update', sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    const smsChannelDelete = await prisma.menu.create({
        data: { name: '渠道删除', type: client_1.MenuType.BUTTON, parentId: smsChannelMenu.id, permission: 'system:sms:delete', sort: 3, status: client_1.CommonStatus.ENABLE },
    });
    const smsTemplateMenu = await prisma.menu.create({
        data: {
            name: '短信模板',
            type: client_1.MenuType.MENU,
            parentId: smsDir.id,
            path: '/system/sms/template',
            icon: 'FileTextOutlined',
            permission: 'system:sms:query',
            component: 'system/sms/template',
            sort: 2,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const smsTemplateCreate = await prisma.menu.create({
        data: { name: '模板新增', type: client_1.MenuType.BUTTON, parentId: smsTemplateMenu.id, permission: 'system:sms:create', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const smsTemplateUpdate = await prisma.menu.create({
        data: { name: '模板修改', type: client_1.MenuType.BUTTON, parentId: smsTemplateMenu.id, permission: 'system:sms:update', sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    const smsTemplateDelete = await prisma.menu.create({
        data: { name: '模板删除', type: client_1.MenuType.BUTTON, parentId: smsTemplateMenu.id, permission: 'system:sms:delete', sort: 3, status: client_1.CommonStatus.ENABLE },
    });
    const smsLogMenu = await prisma.menu.create({
        data: {
            name: '短信日志',
            type: client_1.MenuType.MENU,
            parentId: smsDir.id,
            path: '/system/sms/log',
            icon: 'HistoryOutlined',
            permission: 'system:sms:query',
            component: 'system/sms/log',
            sort: 3,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const smsCodeMenu = await prisma.menu.create({
        data: {
            name: '验证码日志',
            type: client_1.MenuType.MENU,
            parentId: smsDir.id,
            path: '/system/sms/code',
            icon: 'SafetyCertificateOutlined',
            permission: 'system:sms:query',
            component: 'system/sms/code',
            sort: 4,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const mailDir = await prisma.menu.create({
        data: {
            name: '邮件管理',
            type: client_1.MenuType.DIR,
            parentId: sysDir.id,
            path: '/system/mail',
            icon: 'MailOutlined',
            sort: 12,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const mailAccountMenu = await prisma.menu.create({
        data: {
            name: '邮箱账号',
            type: client_1.MenuType.MENU,
            parentId: mailDir.id,
            path: '/system/mail/account',
            icon: 'UserOutlined',
            permission: 'system:mail:query',
            component: 'system/mail/account',
            sort: 1,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const mailAccountCreate = await prisma.menu.create({
        data: { name: '账号新增', type: client_1.MenuType.BUTTON, parentId: mailAccountMenu.id, permission: 'system:mail:create', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const mailAccountUpdate = await prisma.menu.create({
        data: { name: '账号修改', type: client_1.MenuType.BUTTON, parentId: mailAccountMenu.id, permission: 'system:mail:update', sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    const mailAccountDelete = await prisma.menu.create({
        data: { name: '账号删除', type: client_1.MenuType.BUTTON, parentId: mailAccountMenu.id, permission: 'system:mail:delete', sort: 3, status: client_1.CommonStatus.ENABLE },
    });
    const mailTemplateMenu = await prisma.menu.create({
        data: {
            name: '邮件模板',
            type: client_1.MenuType.MENU,
            parentId: mailDir.id,
            path: '/system/mail/template',
            icon: 'FileTextOutlined',
            permission: 'system:mail:query',
            component: 'system/mail/template',
            sort: 2,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const mailTemplateCreate = await prisma.menu.create({
        data: { name: '模板新增', type: client_1.MenuType.BUTTON, parentId: mailTemplateMenu.id, permission: 'system:mail:create', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const mailTemplateUpdate = await prisma.menu.create({
        data: { name: '模板修改', type: client_1.MenuType.BUTTON, parentId: mailTemplateMenu.id, permission: 'system:mail:update', sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    const mailTemplateDelete = await prisma.menu.create({
        data: { name: '模板删除', type: client_1.MenuType.BUTTON, parentId: mailTemplateMenu.id, permission: 'system:mail:delete', sort: 3, status: client_1.CommonStatus.ENABLE },
    });
    const mailLogMenu = await prisma.menu.create({
        data: {
            name: '邮件日志',
            type: client_1.MenuType.MENU,
            parentId: mailDir.id,
            path: '/system/mail/log',
            icon: 'HistoryOutlined',
            permission: 'system:mail:query',
            component: 'system/mail/log',
            sort: 3,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const oauth2ClientMenu = await prisma.menu.create({
        data: {
            name: 'OAuth2 客户端',
            type: client_1.MenuType.MENU,
            parentId: sysDir.id,
            path: '/system/oauth2-client',
            icon: 'SafetyCertificateOutlined',
            permission: 'system:oauth2:query',
            component: 'system/oauth2-client/index',
            sort: 13,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const oauth2ClientCreate = await prisma.menu.create({
        data: { name: '客户端新增', type: client_1.MenuType.BUTTON, parentId: oauth2ClientMenu.id, permission: 'system:oauth2:create', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const oauth2ClientUpdate = await prisma.menu.create({
        data: { name: '客户端修改', type: client_1.MenuType.BUTTON, parentId: oauth2ClientMenu.id, permission: 'system:oauth2:update', sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    const oauth2ClientDelete = await prisma.menu.create({
        data: { name: '客户端删除', type: client_1.MenuType.BUTTON, parentId: oauth2ClientMenu.id, permission: 'system:oauth2:delete', sort: 3, status: client_1.CommonStatus.ENABLE },
    });
    const loginLogMenu = await prisma.menu.create({
        data: {
            name: '登录日志',
            type: client_1.MenuType.MENU,
            parentId: sysDir.id,
            path: '/system/login-log',
            icon: 'LoginOutlined',
            permission: 'system:login-log:query',
            component: 'system/login-log/index',
            sort: 14,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const mallDir = await prisma.menu.create({
        data: {
            name: '商城管理',
            type: client_1.MenuType.DIR,
            path: '/mall',
            icon: 'ShopOutlined',
            sort: 3,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const mallCategoryMenu = await prisma.menu.create({
        data: {
            name: '商品分类',
            type: client_1.MenuType.MENU,
            parentId: mallDir.id,
            path: '/mall/category',
            icon: 'AppstoreOutlined',
            permission: 'mall:category:query',
            component: 'mall/category/index',
            sort: 1,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const mallCategoryCreate = await prisma.menu.create({
        data: { name: '分类新增', type: client_1.MenuType.BUTTON, parentId: mallCategoryMenu.id, permission: 'mall:category:create', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const mallCategoryUpdate = await prisma.menu.create({
        data: { name: '分类修改', type: client_1.MenuType.BUTTON, parentId: mallCategoryMenu.id, permission: 'mall:category:update', sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    const mallCategoryDelete = await prisma.menu.create({
        data: { name: '分类删除', type: client_1.MenuType.BUTTON, parentId: mallCategoryMenu.id, permission: 'mall:category:delete', sort: 3, status: client_1.CommonStatus.ENABLE },
    });
    const mallBrandMenu = await prisma.menu.create({
        data: {
            name: '商品品牌',
            type: client_1.MenuType.MENU,
            parentId: mallDir.id,
            path: '/mall/brand',
            icon: 'CopyrightOutlined',
            permission: 'mall:brand:query',
            component: 'mall/brand/index',
            sort: 2,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const mallBrandCreate = await prisma.menu.create({
        data: { name: '品牌新增', type: client_1.MenuType.BUTTON, parentId: mallBrandMenu.id, permission: 'mall:brand:create', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const mallBrandUpdate = await prisma.menu.create({
        data: { name: '品牌修改', type: client_1.MenuType.BUTTON, parentId: mallBrandMenu.id, permission: 'mall:brand:update', sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    const mallBrandDelete = await prisma.menu.create({
        data: { name: '品牌删除', type: client_1.MenuType.BUTTON, parentId: mallBrandMenu.id, permission: 'mall:brand:delete', sort: 3, status: client_1.CommonStatus.ENABLE },
    });
    const mallPropertyMenu = await prisma.menu.create({
        data: {
            name: '规格管理',
            type: client_1.MenuType.MENU,
            parentId: mallDir.id,
            path: '/mall/property',
            icon: 'TagsOutlined',
            permission: 'mall:property:query',
            component: 'mall/property/index',
            sort: 3,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const mallPropertyCreate = await prisma.menu.create({
        data: { name: '规格新增', type: client_1.MenuType.BUTTON, parentId: mallPropertyMenu.id, permission: 'mall:property:create', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const mallPropertyUpdate = await prisma.menu.create({
        data: { name: '规格修改', type: client_1.MenuType.BUTTON, parentId: mallPropertyMenu.id, permission: 'mall:property:update', sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    const mallPropertyDelete = await prisma.menu.create({
        data: { name: '规格删除', type: client_1.MenuType.BUTTON, parentId: mallPropertyMenu.id, permission: 'mall:property:delete', sort: 3, status: client_1.CommonStatus.ENABLE },
    });
    const mallSpuMenu = await prisma.menu.create({
        data: {
            name: '商品列表',
            type: client_1.MenuType.MENU,
            parentId: mallDir.id,
            path: '/mall/spu',
            icon: 'ShoppingOutlined',
            permission: 'mall:spu:query',
            component: 'mall/spu/index',
            sort: 4,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const mallSpuCreate = await prisma.menu.create({
        data: { name: '商品新增', type: client_1.MenuType.BUTTON, parentId: mallSpuMenu.id, permission: 'mall:spu:create', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const mallSpuUpdate = await prisma.menu.create({
        data: { name: '商品修改', type: client_1.MenuType.BUTTON, parentId: mallSpuMenu.id, permission: 'mall:spu:update', sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    const mallSpuDelete = await prisma.menu.create({
        data: { name: '商品删除', type: client_1.MenuType.BUTTON, parentId: mallSpuMenu.id, permission: 'mall:spu:delete', sort: 3, status: client_1.CommonStatus.ENABLE },
    });
    const memberDir = await prisma.menu.create({
        data: {
            name: '会员管理',
            type: client_1.MenuType.DIR,
            path: '/member',
            icon: 'UserOutlined',
            sort: 4,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const memberUserMenu = await prisma.menu.create({
        data: {
            name: '会员列表',
            type: client_1.MenuType.MENU,
            parentId: memberDir.id,
            path: '/member/user',
            icon: 'UserOutlined',
            permission: 'member:user:query',
            component: 'member/user/index',
            sort: 1,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const memberUserUpdate = await prisma.menu.create({
        data: { name: '会员修改', type: client_1.MenuType.BUTTON, parentId: memberUserMenu.id, permission: 'member:user:update', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const memberLevelMenu = await prisma.menu.create({
        data: {
            name: '会员等级',
            type: client_1.MenuType.MENU,
            parentId: memberDir.id,
            path: '/member/level',
            icon: 'TrophyOutlined',
            permission: 'member:level:query',
            component: 'member/level/index',
            sort: 2,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const memberLevelCreate = await prisma.menu.create({
        data: { name: '等级新增', type: client_1.MenuType.BUTTON, parentId: memberLevelMenu.id, permission: 'member:level:create', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const memberLevelUpdate = await prisma.menu.create({
        data: { name: '等级修改', type: client_1.MenuType.BUTTON, parentId: memberLevelMenu.id, permission: 'member:level:update', sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    const memberLevelDelete = await prisma.menu.create({
        data: { name: '等级删除', type: client_1.MenuType.BUTTON, parentId: memberLevelMenu.id, permission: 'member:level:delete', sort: 3, status: client_1.CommonStatus.ENABLE },
    });
    const memberTagMenu = await prisma.menu.create({
        data: {
            name: '会员标签',
            type: client_1.MenuType.MENU,
            parentId: memberDir.id,
            path: '/member/tag',
            icon: 'TagsOutlined',
            permission: 'member:tag:query',
            component: 'member/tag/index',
            sort: 3,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const memberTagCreate = await prisma.menu.create({
        data: { name: '标签新增', type: client_1.MenuType.BUTTON, parentId: memberTagMenu.id, permission: 'member:tag:create', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const memberTagUpdate = await prisma.menu.create({
        data: { name: '标签修改', type: client_1.MenuType.BUTTON, parentId: memberTagMenu.id, permission: 'member:tag:update', sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    const memberTagDelete = await prisma.menu.create({
        data: { name: '标签删除', type: client_1.MenuType.BUTTON, parentId: memberTagMenu.id, permission: 'member:tag:delete', sort: 3, status: client_1.CommonStatus.ENABLE },
    });
    const memberSignInConfigMenu = await prisma.menu.create({
        data: {
            name: '签到规则',
            type: client_1.MenuType.MENU,
            parentId: memberDir.id,
            path: '/member/sign-in-config',
            icon: 'ScheduleOutlined',
            permission: 'member:sign-in-config:query',
            component: 'member/sign-in-config/index',
            sort: 4,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const memberSignInConfigUpdate = await prisma.menu.create({
        data: { name: '规则修改', type: client_1.MenuType.BUTTON, parentId: memberSignInConfigMenu.id, permission: 'member:sign-in-config:update', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const memberSignInRecordMenu = await prisma.menu.create({
        data: {
            name: '签到记录',
            type: client_1.MenuType.MENU,
            parentId: memberDir.id,
            path: '/member/sign-in-record',
            icon: 'HistoryOutlined',
            permission: 'member:sign-in-record:query',
            component: 'member/sign-in-record/index',
            sort: 5,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const mallOrderMenu = await prisma.menu.create({
        data: {
            name: '订单管理',
            type: client_1.MenuType.MENU,
            parentId: mallDir.id,
            path: '/mall/order',
            icon: 'FileTextOutlined',
            permission: 'mall:order:query',
            component: 'mall/order/index',
            sort: 6,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const mallOrderUpdate = await prisma.menu.create({
        data: { name: '订单修改', type: client_1.MenuType.BUTTON, parentId: mallOrderMenu.id, permission: 'mall:order:update', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const mallRefundMenu = await prisma.menu.create({
        data: {
            name: '退款售后',
            type: client_1.MenuType.MENU,
            parentId: mallDir.id,
            path: '/mall/order-refund',
            icon: 'ReloadOutlined',
            permission: 'mall:refund:query',
            component: 'mall/order-refund/index',
            sort: 7,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const mallRefundUpdate = await prisma.menu.create({
        data: { name: '售后审批', type: client_1.MenuType.BUTTON, parentId: mallRefundMenu.id, permission: 'mall:refund:update', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const mallCouponMenu = await prisma.menu.create({
        data: {
            name: '优惠券管理',
            type: client_1.MenuType.MENU,
            parentId: mallDir.id,
            path: '/mall/coupon',
            icon: 'GiftOutlined',
            permission: 'mall:coupon:query',
            component: 'mall/coupon/index',
            sort: 8,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const mallCouponCreate = await prisma.menu.create({
        data: { name: '优惠券新增', type: client_1.MenuType.BUTTON, parentId: mallCouponMenu.id, permission: 'mall:coupon:create', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const mallCouponUpdate = await prisma.menu.create({
        data: { name: '优惠券修改', type: client_1.MenuType.BUTTON, parentId: mallCouponMenu.id, permission: 'mall:coupon:update', sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    const mallCouponDelete = await prisma.menu.create({
        data: { name: '优惠券删除', type: client_1.MenuType.BUTTON, parentId: mallCouponMenu.id, permission: 'mall:coupon:delete', sort: 3, status: client_1.CommonStatus.ENABLE },
    });
    const payDir = await prisma.menu.create({
        data: {
            name: '支付中心',
            type: client_1.MenuType.DIR,
            path: '/pay',
            icon: 'TransactionOutlined',
            sort: 5,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const payAppMenu = await prisma.menu.create({
        data: {
            name: '支付应用',
            type: client_1.MenuType.MENU,
            parentId: payDir.id,
            path: '/pay/app',
            icon: 'SlidersOutlined',
            permission: 'pay:app:query',
            component: 'pay/app/index',
            sort: 1,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const payAppCreate = await prisma.menu.create({
        data: { name: '应用新增', type: client_1.MenuType.BUTTON, parentId: payAppMenu.id, permission: 'pay:app:create', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const payAppUpdate = await prisma.menu.create({
        data: { name: '应用修改', type: client_1.MenuType.BUTTON, parentId: payAppMenu.id, permission: 'pay:app:update', sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    const payAppDelete = await prisma.menu.create({
        data: { name: '应用删除', type: client_1.MenuType.BUTTON, parentId: payAppMenu.id, permission: 'pay:app:delete', sort: 3, status: client_1.CommonStatus.ENABLE },
    });
    const payOrderMenu = await prisma.menu.create({
        data: {
            name: '支付订单',
            type: client_1.MenuType.MENU,
            parentId: payDir.id,
            path: '/pay/order',
            icon: 'OrderedListOutlined',
            permission: 'pay:order:query',
            component: 'pay/order/index',
            sort: 2,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const payOrderUpdate = await prisma.menu.create({
        data: { name: '模拟支付', type: client_1.MenuType.BUTTON, parentId: payOrderMenu.id, permission: 'pay:order:update', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const payRefundMenu = await prisma.menu.create({
        data: {
            name: '退款订单',
            type: client_1.MenuType.MENU,
            parentId: payDir.id,
            path: '/pay/refund',
            icon: 'RollbackOutlined',
            permission: 'pay:refund:query',
            component: 'pay/refund/index',
            sort: 3,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const payRefundUpdate = await prisma.menu.create({
        data: { name: '模拟退款', type: client_1.MenuType.BUTTON, parentId: payRefundMenu.id, permission: 'pay:refund:update', sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    console.log('Menus seeded.');
    const allMenus = [
        sysDir, userMenu, roleMenu, menuMenu, userCreate, userUpdate, userDelete,
        dictMenu, configMenu, infraDir, fileConfigMenu, fileListMenu, logMenu, codegenMenu, jobMenu,
        notifyTemplateMenu, notifyTemplateCreate, notifyTemplateUpdate, notifyTemplateDelete,
        userSessionMenu, userSessionDelete,
        postMenu, postCreate, postUpdate, postDelete,
        deptMenu, deptCreate, deptUpdate, deptDelete,
        noticeMenu, noticeCreate, noticeUpdate, noticeDelete,
        smsDir, smsChannelMenu, smsChannelCreate, smsChannelUpdate, smsChannelDelete,
        smsTemplateMenu, smsTemplateCreate, smsTemplateUpdate, smsTemplateDelete, smsLogMenu, smsCodeMenu,
        mailDir, mailAccountMenu, mailAccountCreate, mailAccountUpdate, mailAccountDelete,
        mailTemplateMenu, mailTemplateCreate, mailTemplateUpdate, mailTemplateDelete, mailLogMenu,
        oauth2ClientMenu, oauth2ClientCreate, oauth2ClientUpdate, oauth2ClientDelete,
        loginLogMenu,
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
        memberSignInConfigMenu, memberSignInConfigUpdate, memberSignInRecordMenu,
        payDir, payAppMenu, payAppCreate, payAppUpdate, payAppDelete,
        payOrderMenu, payOrderUpdate, payRefundMenu, payRefundUpdate
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
    await prisma.notifyTemplate.upsert({
        where: { code: 'user_welcome' },
        update: {},
        create: {
            name: '用户注册欢迎模版',
            code: 'user_welcome',
            type: 'SYSTEM',
            title: '欢迎注册系统',
            content: '你好，{nickname}！欢迎注册 {systemName}！您的账号是 {username}。',
            status: client_1.CommonStatus.ENABLE,
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
            status: client_1.CommonStatus.ENABLE,
            remark: '用于系统后台邮件测试',
        },
    });
    console.log('Notification templates seeded.');
    await prisma.sysJob.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: '操作审计日志清理',
            handlerName: 'logCleanupJob',
            cronExpression: '0 0 2 * * *',
            status: client_1.CommonStatus.DISABLE,
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
            status: client_1.CommonStatus.DISABLE,
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
            status: client_1.CommonStatus.ENABLE,
            remark: '每日凌晨3点自动清理过期的用户登录会话',
        },
    });
    await prisma.sysJob.upsert({
        where: { id: 4 },
        update: {},
        create: {
            id: 4,
            name: '支付通知重试回调',
            handlerName: 'payNotifyJob',
            cronExpression: '*/10 * * * * *',
            status: client_1.CommonStatus.ENABLE,
            remark: '每10秒自动扫描并重试发送失败的支付/退款回调通知',
        },
    });
    console.log('Background jobs seeded.');
    console.log('Seeding E-commerce Mall sample data...');
    const catDigital = await prisma.mallCategory.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: '手机数码',
            parentId: null,
            picUrl: '/category/digital.png',
            sort: 1,
            status: client_1.CommonStatus.ENABLE,
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
            status: client_1.CommonStatus.ENABLE,
        },
    });
    const brandApple = await prisma.mallBrand.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: '苹果 (Apple)',
            logo: '/brand/apple.png',
            sort: 1,
            status: client_1.CommonStatus.ENABLE,
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
            status: client_1.CommonStatus.ENABLE,
        },
    });
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
            status: client_1.CommonStatus.ENABLE,
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
    console.log('Seeding Member users, Orders, and Refunds...');
    await prisma.memberSignInRecord.deleteMany({});
    await prisma.memberSignInConfig.deleteMany({});
    await prisma.memberTag.deleteMany({});
    await prisma.mallOrderRefund.deleteMany({});
    await prisma.mallOrderItem.deleteMany({});
    await prisma.mallOrder.deleteMany({});
    await prisma.memberUser.deleteMany({});
    await prisma.memberLevel.deleteMany({});
    const lvlBronze = await prisma.memberLevel.create({
        data: { name: '青铜会员', level: 1, experience: 0, discountPercent: 100 }
    });
    const lvlSilver = await prisma.memberLevel.create({
        data: { name: '白银会员', level: 2, experience: 1000, discountPercent: 95 }
    });
    const lvlGold = await prisma.memberLevel.create({
        data: { name: '黄金会员', level: 3, experience: 5000, discountPercent: 90 }
    });
    const tagHighSpender = await prisma.memberTag.create({
        data: { name: '高客单价', description: '历史累计消费金额较高的会员客户' }
    });
    const tagSleepy = await prisma.memberTag.create({
        data: { name: '沉睡会员', description: '超过30天未活跃登录的会员' }
    });
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
    const member1 = await prisma.memberUser.upsert({
        where: { mobile: '13800138000' },
        update: {},
        create: {
            nickname: '张三',
            mobile: '13800138000',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80',
            points: 1000,
            balance: 500000,
            experience: 1500,
            levelId: lvlSilver.id,
            tagIds: [tagHighSpender.id],
            status: client_1.CommonStatus.ENABLE,
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
            balance: 200000,
            experience: 0,
            levelId: lvlBronze.id,
            tagIds: [tagSleepy.id],
            status: client_1.CommonStatus.DISABLE,
        },
    });
    await prisma.memberSignInRecord.create({
        data: {
            memberId: member1.id,
            day: 1,
            point: 10,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
    });
    await prisma.memberSignInRecord.create({
        data: {
            memberId: member1.id,
            day: 2,
            point: 20,
            createdAt: new Date()
        }
    });
    const spuPhone = await prisma.mallSpu.findFirst({
        where: { id: 1 },
        include: { skus: true },
    });
    if (spuPhone && spuPhone.skus.length >= 2) {
        const skuBlack = spuPhone.skus[0];
        const skuWhite = spuPhone.skus[1];
        const order1 = await prisma.mallOrder.create({
            data: {
                no: 'ORD202606120001',
                memberId: member1.id,
                status: client_1.MallOrderStatus.UNPAID,
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
        const order2 = await prisma.mallOrder.create({
            data: {
                no: 'ORD202606120002',
                memberId: member1.id,
                status: client_1.MallOrderStatus.UNDELIVERED,
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
        const order3 = await prisma.mallOrder.create({
            data: {
                no: 'ORD202606120003',
                memberId: member2.id,
                status: client_1.MallOrderStatus.DELIVERED,
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
        await prisma.mallOrderRefund.create({
            data: {
                no: 'REF202606120001',
                orderId: order2.id,
                memberId: member1.id,
                refundPrice: 699900,
                status: client_1.MallRefundStatus.APPLY,
                reason: '商品买多了，申请退款一件',
                userRemark: '多买了一台，想退款',
            },
        });
        await prisma.mallCouponUser.deleteMany({});
        await prisma.mallCoupon.deleteMany({});
        const coupon1 = await prisma.mallCoupon.create({
            data: {
                name: '全场通用代金券',
                type: 'CASH',
                minPrice: 0,
                value: 10000,
                totalCount: 100,
                takeCount: 2,
                useCount: 1,
                scopeType: 'ALL',
                validityType: 'DATE',
                validStartTime: new Date(),
                validEndTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                status: client_1.CommonStatus.ENABLE,
            },
        });
        const coupon2 = await prisma.mallCoupon.create({
            data: {
                name: '数码折后券',
                type: 'DISCOUNT',
                minPrice: 20000,
                value: 85,
                totalCount: 50,
                takeCount: 1,
                useCount: 1,
                scopeType: 'CATEGORY',
                scopeValue: [1],
                validityType: 'TERM',
                validDays: 7,
                status: client_1.CommonStatus.ENABLE,
            },
        });
        const coupon3 = await prisma.mallCoupon.create({
            data: {
                name: 'Mate60专享券',
                type: 'CASH',
                minPrice: 600000,
                value: 50000,
                totalCount: 200,
                takeCount: 0,
                useCount: 0,
                scopeType: 'SPU',
                scopeValue: [1],
                validityType: 'DATE',
                validStartTime: new Date(),
                validEndTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                status: client_1.CommonStatus.ENABLE,
            },
        });
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
    console.log('Seeding payment apps and channels...');
    const payApp = await prisma.payApp.upsert({
        where: { code: 'mall_app' },
        update: {},
        create: {
            name: '商城应用',
            code: 'mall_app',
            status: client_1.CommonStatus.ENABLE,
            remark: '商城主包支付应用',
        },
    });
    await prisma.payChannel.upsert({
        where: {
            appId_code: {
                appId: payApp.id,
                code: 'mock',
            },
        },
        update: {},
        create: {
            appId: payApp.id,
            code: 'mock',
            config: { enabled: true },
            status: client_1.CommonStatus.ENABLE,
            remark: '模拟支付测试通道',
        },
    });
    await prisma.payChannel.upsert({
        where: {
            appId_code: {
                appId: payApp.id,
                code: 'alipay',
            },
        },
        update: {},
        create: {
            appId: payApp.id,
            code: 'alipay',
            config: {
                appId: '2021000123456789',
                privateKey: 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQ...',
                publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...',
            },
            status: client_1.CommonStatus.ENABLE,
            remark: '支付宝应用内支付/网页支付通道',
        },
    });
    await prisma.payChannel.upsert({
        where: {
            appId_code: {
                appId: payApp.id,
                code: 'wechat',
            },
        },
        update: {},
        create: {
            appId: payApp.id,
            code: 'wechat',
            config: {
                appId: 'wx1234567890abcdef',
                mchId: '1900000109',
                apiKey: '32charslongkeysecretkeyvaluehere',
            },
            status: client_1.CommonStatus.DISABLE,
            remark: '微信小程序/JSAPI支付通道',
        },
    });
    console.log('Seeding post data...');
    await prisma.post.deleteMany({});
    await prisma.post.createMany({
        data: [
            { name: '董事长', code: 'ceo', sort: 1, remark: '公司董事长', status: client_1.CommonStatus.ENABLE },
            { name: '项目经理', code: 'pm', sort: 2, remark: '各项目负责人', status: client_1.CommonStatus.ENABLE },
            { name: '开发人员', code: 'dev', sort: 3, remark: '研发部门程序员', status: client_1.CommonStatus.ENABLE },
            { name: '测试人员', code: 'test', sort: 4, remark: '质量保证测试员', status: client_1.CommonStatus.ENABLE },
        ],
    });
    console.log('Seeding departments...');
    await prisma.dept.deleteMany({});
    const deptRd = await prisma.dept.create({
        data: { name: '研发部', parentId: 0, sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    const deptMkt = await prisma.dept.create({
        data: { name: '市场部', parentId: 0, sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    await prisma.dept.create({
        data: { name: '开发组', parentId: deptRd.id, sort: 1, status: client_1.CommonStatus.ENABLE },
    });
    await prisma.dept.create({
        data: { name: '测试组', parentId: deptRd.id, sort: 2, status: client_1.CommonStatus.ENABLE },
    });
    console.log('Seeding notices...');
    await prisma.notice.deleteMany({});
    await prisma.notice.createMany({
        data: [
            { title: '关于系统正式上线的通知', type: 1, content: '经过开发团队数月的努力，芋道管理系统正式上线运行！', status: client_1.CommonStatus.ENABLE },
            { title: '2026年端午节放假安排公告', type: 2, content: '2026年端午节放假安排如下：6月15日至6月17日放假公休，共3天。请大家做好工作安排。', status: client_1.CommonStatus.ENABLE },
        ],
    });
    console.log('Seeding SMS configurations...');
    await prisma.smsLog.deleteMany({});
    await prisma.smsTemplate.deleteMany({});
    await prisma.smsChannel.deleteMany({});
    const aliSms = await prisma.smsChannel.create({
        data: {
            code: 'aliyun',
            name: '阿里云短信',
            apiKey: 'LTAI5tMockApiKey',
            apiSecret: 'MockApiSecretValueHere',
            signature: '芋道源码',
            status: client_1.CommonStatus.ENABLE,
            remark: '线上生产短信通道',
        },
    });
    await prisma.smsChannel.create({
        data: {
            code: 'tencent',
            name: '腾讯云短信',
            apiKey: 'mock_sdk_app_id',
            apiSecret: 'mock_app_key',
            signature: '芋道源码',
            status: client_1.CommonStatus.DISABLE,
            remark: '测试备用短信通道',
        },
    });
    await prisma.smsTemplate.create({
        data: {
            channelId: aliSms.id,
            code: 'sms_login',
            name: '验证码登录模板',
            content: '您的登录验证码是 {code}，有效期5分钟，请勿泄露。',
            status: client_1.CommonStatus.ENABLE,
        },
    });
    console.log('Seeding Mail configurations...');
    await prisma.mailLog.deleteMany({});
    await prisma.mailTemplate.deleteMany({});
    await prisma.mailAccount.deleteMany({});
    const mailAcc = await prisma.mailAccount.create({
        data: {
            mail: 'yudao_test@163.com',
            username: 'yudao_test',
            password: 'yudaoPassword123',
            host: 'smtp.163.com',
            port: 465,
            ssl: true,
            status: client_1.CommonStatus.ENABLE,
        },
    });
    await prisma.mailTemplate.create({
        data: {
            accountId: mailAcc.id,
            code: 'mail_login',
            name: '验证码登录邮件',
            title: '【芋道系统】登录验证码',
            content: '<h3>您好：</h3><p>您的登录验证码是 <strong>{code}</strong>，请在5分钟内输入。如非本人操作，请忽略此邮件。</p>',
            status: client_1.CommonStatus.ENABLE,
        },
    });
    console.log('Seeding OAuth2 Client configurations...');
    await prisma.oAuth2Client.deleteMany({});
    await prisma.oAuth2Client.create({
        data: {
            clientId: 'yudao_sso_client',
            secret: 'yudao_sso_secret',
            name: '单点登录测试客户端',
            redirectUris: '["http://localhost:3001/sso-callback"]',
            scopes: '["user_info", "roles"]',
            status: client_1.CommonStatus.ENABLE,
        },
    });
    console.log('Seeding Social Client configurations...');
    await prisma.socialClient.deleteMany({});
    await prisma.socialClient.create({
        data: {
            type: 'GITHUB',
            clientId: 'github_client_id_placeholder',
            clientSecret: 'github_client_secret_placeholder',
            redirectUri: 'http://localhost:3001/social-callback',
            status: client_1.CommonStatus.ENABLE,
        },
    });
    console.log('Clearing old Login logs...');
    await prisma.loginLog.deleteMany({});
    console.log('Seeding CMS data...');
    const catTech = await prisma.cmsCategory.create({ data: { name: '技术文章', code: 'tech', sort: 1, status: client_1.CommonStatus.ENABLE, remark: '技术相关文章' } });
    const catNews = await prisma.cmsCategory.create({ data: { name: '新闻资讯', code: 'news', sort: 2, status: client_1.CommonStatus.ENABLE, remark: '新闻资讯类文章' } });
    const catProduct = await prisma.cmsCategory.create({ data: { name: '产品动态', code: 'product', sort: 3, status: client_1.CommonStatus.ENABLE, remark: '产品更新和动态' } });
    const catActivity = await prisma.cmsCategory.create({ data: { name: '活动公告', code: 'activity', sort: 4, status: client_1.CommonStatus.ENABLE, remark: '活动和公告' } });
    const catTutorial = await prisma.cmsCategory.create({ data: { name: '使用教程', code: 'tutorial', sort: 5, status: client_1.CommonStatus.ENABLE, remark: '产品使用教程' } });
    const tagNestjs = await prisma.cmsTag.create({ data: { name: 'NestJS', status: client_1.CommonStatus.ENABLE } });
    const tagReact = await prisma.cmsTag.create({ data: { name: 'React', status: client_1.CommonStatus.ENABLE } });
    const tagPrisma = await prisma.cmsTag.create({ data: { name: 'Prisma', status: client_1.CommonStatus.ENABLE } });
    const tagTypeScript = await prisma.cmsTag.create({ data: { name: 'TypeScript', status: client_1.CommonStatus.ENABLE } });
    const tagAntd = await prisma.cmsTag.create({ data: { name: 'Ant Design', status: client_1.CommonStatus.ENABLE } });
    const tagDocker = await prisma.cmsTag.create({ data: { name: 'Docker', status: client_1.CommonStatus.ENABLE } });
    const tagPostgres = await prisma.cmsTag.create({ data: { name: 'PostgreSQL', status: client_1.CommonStatus.ENABLE } });
    const tagSecurity = await prisma.cmsTag.create({ data: { name: '安全', status: client_1.CommonStatus.ENABLE } });
    const articleStatuses = ['PUBLISHED', 'PUBLISHED', 'PUBLISHED', 'DRAFT', 'ARCHIVED'];
    const categories = [catTech, catNews, catProduct, catActivity, catTutorial];
    const tagSets = [
        [tagNestjs.id, tagTypeScript.id],
        [tagReact.id, tagAntd.id],
        [tagPrisma.id, tagPostgres.id],
        [tagDocker.id],
        [tagNestjs.id, tagReact.id, tagTypeScript.id],
    ];
    const articleTitles = [
        'NestJS 入门指南：从零搭建后端项目',
        'React 19 新特性全面解析',
        'Prisma ORM 最佳实践与性能优化',
        'TypeScript 5.x 高级类型体操技巧',
        'Ant Design 6 迁移指南',
        'Docker Compose 多服务编排实战',
        'PostgreSQL 索引优化策略',
        'JWT 认证与刷新令牌机制详解',
        'RBAC 权限系统设计与实现',
        'RESTful API 设计规范与最佳实践',
        '系统架构设计：微服务 vs 单体',
        '前端性能优化：懒加载与代码分割',
        'Node.js 内存泄漏排查与预防',
        'GraphQL vs REST API 选型分析',
        '数据库事务与分布式锁实现',
        'WebSocket 实时通信方案对比',
        'Redis 缓存策略与缓存穿透处理',
        'NestJS 拦截器与中间件深入理解',
        '前后端分离项目部署最佳实践',
        'CSS-in-JS 方案对比：styled-components vs emotion',
        '单元测试与集成测试覆盖率提升',
        'CI/CD 流水线搭建：GitHub Actions 实战',
        'Elasticsearch 全文搜索引擎入门',
        'WebSocket 聊天室项目实战',
        'NestJS + Prisma 全栈项目模板',
        'React 状态管理：Zustand vs Jotai',
        'Vue 3 组合式 API 最佳实践',
        'Git 工作流：GitFlow vs Trunk-Based',
        '代码审查清单：提升团队代码质量',
        '微前端架构方案选型与实践',
    ];
    const articleContents = articleTitles.map((title, i) => `<h2>${title}</h2><p>这是关于「${title}」的详细文章内容。</p><p>在本文中，我们将深入探讨这个话题的各个方面，包括核心概念、最佳实践和常见陷阱。</p><p>第 ${i + 1} 段：通过实际案例来说明这些概念的应用。</p><p>总结：掌握这些知识将帮助你在项目中做出更好的技术决策。</p>`);
    for (let i = 0; i < 30; i++) {
        const article = await prisma.cmsArticle.create({
            data: {
                categoryId: categories[i % categories.length].id,
                title: articleTitles[i],
                content: articleContents[i],
                summary: `${articleTitles[i]}的摘要内容，简要介绍本文的主要观点。`,
                coverUrl: `https://picsum.photos/800/400?random=${i + 1}`,
                author: 'admin',
                viewCount: Math.floor(Math.random() * 500),
                likeCount: Math.floor(Math.random() * 100),
                sortOrder: i,
                status: articleStatuses[i % articleStatuses.length],
                isTop: i < 3,
                isRecommend: i < 5,
            },
        });
        const tagSet = tagSets[i % tagSets.length];
        for (const tagId of tagSet) {
            await prisma.cmsArticleTag.create({ data: { articleId: article.id, tagId } });
        }
    }
    const commentStatuses = ['APPROVED', 'APPROVED', 'PENDING', 'REJECTED'];
    for (let i = 0; i < 20; i++) {
        await prisma.cmsComment.create({
            data: {
                articleId: (i % 10) + 1,
                nickname: `用户${i + 1}`,
                content: `这是第 ${i + 1} 条评论内容，关于文章的讨论和反馈。${i % 3 === 0 ? '非常棒的文章！' : '感谢分享！'}`,
                status: commentStatuses[i % commentStatuses.length],
            },
        });
    }
    const bannerTitles = [
        '春季新品上市', '会员日特惠活动', '双十一预售开启', '年终大促',
        '新品首发限量抢', '限时折扣专区', '满减活动进行中', '节日礼品推荐',
    ];
    for (let i = 0; i < 8; i++) {
        await prisma.cmsBanner.create({
            data: {
                title: bannerTitles[i],
                picUrl: `https://picsum.photos/1200/400?random=banner${i + 1}`,
                url: `https://example.com/activity/${i + 1}`,
                sort: i,
                status: i < 6 ? client_1.CommonStatus.ENABLE : client_1.CommonStatus.DISABLE,
                remark: `第 ${i + 1} 个轮播图`,
            },
        });
    }
    console.log('CMS data seeded: 5 categories, 8 tags, 30 articles, 20 comments, 8 banners.');
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
//# sourceMappingURL=seed.js.map