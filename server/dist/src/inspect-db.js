"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('=== Users ===');
    const users = await prisma.user.findMany();
    console.log(users.map(u => ({ id: u.id, username: u.username, nickname: u.nickname, status: u.status })));
    console.log('=== User Sessions ===');
    const sessions = await prisma.userSession.findMany();
    console.log(sessions);
    console.log('=== User Roles ===');
    const userRoles = await prisma.userRole.findMany({
        include: { role: true }
    });
    console.log(userRoles);
}
main()
    .catch(e => console.error(e))
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=inspect-db.js.map