import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UserCacheService } from '../../shared/user-cache.service';
import { paginateQuery } from '../../shared/pagination';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private userCache: UserCacheService,
  ) {}

  async create(data: any) {
    const existing = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existing) {
      throw new BadRequestException('用户名已存在');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const { roleIds, postIds, ...rest } = data;

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });

    if (roleIds && roleIds.length > 0) {
      await this.assignRoles(user.id, roleIds);
    }

    if (postIds && postIds.length > 0) {
      await this.assignPosts(user.id, postIds);
    }

    return user;
  }

  private buildWhere(query?: any) {
    const where: any = {};
    if (query?.username) {
      where.username = { contains: query.username };
    }
    if (query?.nickname) {
      where.nickname = { contains: query.nickname };
    }
    if (query?.mobile) {
      where.mobile = { contains: query.mobile };
    }
    if (query?.status) {
      where.status = query.status;
    }
    if (query?.deptId) {
      where.deptId = Number(query.deptId);
    }
    return where;
  }

  async findAll(query?: any) {
    const where = this.buildWhere(query);

    return paginateQuery(this.prisma, 'user', query || {}, {
      where,
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
        posts: { include: { post: true } },
        dept: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAllForExport(query?: any) {
    return this.prisma.user.findMany({
      where: this.buildWhere(query),
      orderBy: { id: 'desc' },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        mobile: true,
        status: true,
        remark: true,
        createdAt: true,
        dept: { select: { name: true } },
      },
    });
  }

  async importUsers(
    rows: Record<string, any>[],
    updateSupport = false,
  ): Promise<{
    createUsernames: string[];
    updateUsernames: string[];
    failureUsernames: Record<string, string>;
  }> {
    const createUsernames: string[] = [];
    const updateUsernames: string[] = [];
    const failureUsernames: Record<string, string> = {};

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const username = String(row['用户名'] ?? row['username'] ?? '').trim();
      const nickname = String(row['用户昵称'] ?? row['昵称'] ?? row['nickname'] ?? '').trim();
      const email = String(row['邮箱'] ?? row['email'] ?? '').trim() || null;
      const mobile = String(row['手机号'] ?? row['mobile'] ?? '').trim() || null;
      const rawPassword = String(row['密码'] ?? row['password'] ?? '').trim();
      const rawStatus = String(row['状态'] ?? row['status'] ?? 'ENABLE').trim();
      const remark = String(row['备注'] ?? row['remark'] ?? '').trim() || null;
      const status =
        rawStatus === '禁用' || rawStatus.toUpperCase() === 'DISABLE'
          ? 'DISABLE'
          : 'ENABLE';

      if (!username) {
        failureUsernames[`第${i + 2}行`] = '用户名不能为空';
        continue;
      }

      try {
        const existing = await this.prisma.user.findUnique({
          where: { username },
        });
        if (!existing) {
          const password = await bcrypt.hash(rawPassword || '123456', 10);
          await this.prisma.user.create({
            data: {
              username,
              nickname: nickname || username,
              email,
              mobile,
              password,
              status,
              remark,
            },
          });
          createUsernames.push(username);
        } else if (updateSupport) {
          const updateData: any = {
            nickname: nickname || existing.nickname,
            email: email ?? existing.email,
            mobile: mobile ?? existing.mobile,
            status,
            remark: remark ?? existing.remark,
          };
          if (rawPassword) {
            updateData.password = await bcrypt.hash(rawPassword, 10);
          }
          await this.prisma.user.update({
            where: { id: existing.id },
            data: updateData,
          });
          updateUsernames.push(username);
        } else {
          failureUsernames[username] = '用户名已存在';
        }
      } catch (err: any) {
        failureUsernames[username] = err?.message || '导入失败';
      }
    }

    return { createUsernames, updateUsernames, failureUsernames };
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: { select: { roleId: true } },
        posts: { select: { postId: true } },
      },
    });
  }

  async update(id: number, data: any) {
    const { roleIds, postIds, password, ...rest } = data;
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

    if (postIds !== undefined) {
      await this.assignPosts(id, postIds);
    }

    return user;
  }

  async remove(id: number) {
    if (id === 1) {
      throw new BadRequestException('系统内置超级管理员，无法删除');
    }
    const result = await this.prisma.user.delete({ where: { id } });
    this.userCache.invalidateUser(id);
    return result;
  }

  async assignRoles(userId: number, roleIds: number[]) {
    await this.prisma.userRole.deleteMany({ where: { userId } });
    if (roleIds.length > 0) {
      const mappings = roleIds.map((roleId) => ({ userId, roleId }));
      await this.prisma.userRole.createMany({ data: mappings });
    }
    this.userCache.invalidateUser(userId);
    return { success: true };
  }

  async assignPosts(userId: number, postIds: number[]) {
    await this.prisma.userPost.deleteMany({ where: { userId } });
    if (postIds.length > 0) {
      const mappings = postIds.map((postId) => ({ userId, postId }));
      await this.prisma.userPost.createMany({ data: mappings });
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
        avatar: true,
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

  async updateProfile(
    userId: number,
    data: { nickname: string; email?: string | null; mobile?: string | null; avatar?: string | null },
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        nickname: data.nickname,
        email: data.email,
        mobile: data.mobile,
        avatar: data.avatar,
      },
      select: {
        id: true,
        username: true,
        nickname: true,
        avatar: true,
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

    const isPasswordValid = await bcrypt.compare(
      data.oldPassword,
      user.password,
    );
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
