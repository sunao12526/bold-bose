import { Injectable } from '@nestjs/common';
import { CommonStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { DataScope, DeptDataPermission } from './data-permission.types';

@Injectable()
export class DataPermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async getDeptDataPermission(userId: number): Promise<DeptDataPermission> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        deptId: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return { all: false, self: false, deptIds: [] };
    }

    const activeRoles = (user.roles || [])
      .map((ur) => ur.role)
      .filter((r) => r && r.status === CommonStatus.ENABLE);

    if (
      activeRoles.some(
        (r) => r.code === 'super_admin' || r.dataScope === DataScope.ALL,
      )
    ) {
      return { all: true, self: false, deptIds: [] };
    }

    let self = false;
    const deptSet = new Set<number>();
    let childDeptsCache: Array<{ id: number; parentId: number }> | null = null;

    for (const role of activeRoles) {
      switch (role.dataScope) {
        case DataScope.DEPT_CUSTOM: {
          const customIds = Array.isArray(role.dataScopeDeptIds)
            ? (role.dataScopeDeptIds as number[])
            : [];
          for (const id of customIds) {
            if (Number.isInteger(Number(id))) {
              deptSet.add(Number(id));
            }
          }
          break;
        }
        case DataScope.DEPT_ONLY: {
          if (user.deptId) {
            deptSet.add(user.deptId);
          }
          break;
        }
        case DataScope.DEPT_AND_CHILD: {
          if (user.deptId) {
            if (!childDeptsCache) {
              childDeptsCache = await this.prisma.dept.findMany({
                select: { id: true, parentId: true },
              });
            }
            for (const id of this.collectDescendantDeptIds(
              user.deptId,
              childDeptsCache,
            )) {
              deptSet.add(id);
            }
          }
          break;
        }
        case DataScope.SELF: {
          self = true;
          break;
        }
        default:
          break;
      }
    }

    return {
      all: false,
      self,
      deptIds: Array.from(deptSet),
    };
  }

  async buildUserScopeWhere(
    userId: number,
    options?: { deptField?: string; userField?: string },
  ): Promise<Record<string, any>> {
    const deptField = options?.deptField ?? 'deptId';
    const userField = options?.userField ?? 'id';
    const perm = await this.getDeptDataPermission(userId);

    if (perm.all) {
      return {};
    }

    const conditions: Record<string, any>[] = [];
    if (perm.deptIds.length > 0) {
      conditions.push({ [deptField]: { in: perm.deptIds } });
    }
    if (perm.self) {
      conditions.push({ [userField]: userId });
    }

    if (conditions.length === 0) {
      return { [userField]: -1 };
    }
    if (conditions.length === 1) {
      return conditions[0];
    }
    return { OR: conditions };
  }

  private collectDescendantDeptIds(
    rootId: number,
    allDepts: Array<{ id: number; parentId: number }>,
  ): number[] {
    const childrenMap = new Map<number, number[]>();
    for (const d of allDepts) {
      const list = childrenMap.get(d.parentId) || [];
      list.push(d.id);
      childrenMap.set(d.parentId, list);
    }

    const visited = new Set<number>([rootId]);
    const queue = [rootId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      const children = childrenMap.get(current) || [];
      for (const cid of children) {
        if (!visited.has(cid)) {
          visited.add(cid);
          queue.push(cid);
        }
      }
    }
    return Array.from(visited);
  }
}
