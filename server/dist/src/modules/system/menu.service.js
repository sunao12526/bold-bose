"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/prisma/prisma.service");
let MenuService = class MenuService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.menu.create({ data });
    }
    async findAll() {
        return this.prisma.menu.findMany({
            orderBy: { sort: 'asc' },
        });
    }
    async findOne(id) {
        return this.prisma.menu.findUnique({ where: { id } });
    }
    async update(id, data) {
        return this.prisma.menu.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        const children = await this.prisma.menu.findFirst({
            where: { parentId: id },
        });
        if (children) {
            throw new common_1.BadRequestException('该菜单包含子菜单，无法删除');
        }
        return this.prisma.menu.delete({ where: { id } });
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuService);
//# sourceMappingURL=menu.service.js.map