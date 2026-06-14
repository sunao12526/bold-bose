import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const existing = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existing) {
      throw new BadRequestException('用户名已存在');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const { roleIds, ...rest } = data;

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });

    if (roleIds && roleIds.length > 0) {
      await this.assignRoles(user.id, roleIds);
    }

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        mobile: true,
        status: true,
        remark: true,
        deptId: true,
        createdAt: true,
        updatedAt: true,
        roles: { include: { role: true } },
        dept: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { roles: { select: { roleId: true } } },
    });
  }

  async update(id: number, data: any) {
    const { roleIds, password, ...rest } = data;
    const updateData: any = { ...rest };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    if (roleIds !== undefined) {
      await this.assignRoles(id, roleIds);
    }

    return user;
  }

  async remove(id: number) {
    if (id === 1) {
      throw new BadRequestException('系统内置超级管理员，无法删除');
    }
    return this.prisma.user.delete({ where: { id } });
  }

  async assignRoles(userId: number, roleIds: number[]) {
    await this.prisma.userRole.deleteMany({ where: { userId } });
    if (roleIds.length > 0) {
      const mappings = roleIds.map((roleId) => ({ userId, roleId }));
      await this.prisma.userRole.createMany({ data: mappings });
    }
    return { success: true };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        mobile: true,
        remark: true,
        status: true,
        createdAt: true,
      },
    });
    if (!user) throw new BadRequestException('用户不存在');

    // Get roles
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
    const roles = userRoles.map((ur) => ({
      id: ur.role.id,
      name: ur.role.name,
      code: ur.role.code,
    }));

    return {
      user,
      roles,
    };
  }

  async updateProfile(userId: number, data: { nickname: string; email?: string; mobile?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        nickname: data.nickname,
        email: data.email,
        mobile: data.mobile,
      },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        mobile: true,
      }
    });
  }

  async updatePassword(userId: number, data: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new BadRequestException('用户不存在');

    const isPasswordValid = await bcrypt.compare(data.oldPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('原密码错误，请重新输入');
    }

    const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { success: true };
  }
}
