import { Test, TestingModule } from '@nestjs/testing';
import { CommonStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { DataPermissionService } from './data-permission.service';
import { DataScope } from './data-permission.types';

describe('DataPermissionService', () => {
  let service: DataPermissionService;

  const mockPrisma = {
    user: { findUnique: jest.fn() },
    dept: { findMany: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataPermissionService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DataPermissionService>(DataPermissionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('超级管理员或拥有 ALL 角色应返回 all=true 且 where 为空对象', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: 1,
      deptId: 10,
      roles: [{ role: { code: 'super_admin', status: CommonStatus.ENABLE, dataScope: DataScope.SELF } }],
    });

    const where = await service.buildUserScopeWhere(1);
    expect(where).toEqual({});
  });

  it('本部门及以下权限应递归收集所有子孙部门 ID', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: 2,
      deptId: 100,
      roles: [{ role: { code: 'dept_mgr', status: CommonStatus.ENABLE, dataScope: DataScope.DEPT_AND_CHILD } }],
    });
    mockPrisma.dept.findMany.mockResolvedValueOnce([
      { id: 100, parentId: 0 },
      { id: 101, parentId: 100 },
      { id: 102, parentId: 101 },
      { id: 200, parentId: 0 },
    ]);

    const where = await service.buildUserScopeWhere(2);
    expect(where).toEqual({ deptId: { in: [100, 101, 102] } });
  });

  it('自定义部门 + 仅本人双角色合并应生成 OR 条件', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: 5,
      deptId: 10,
      roles: [
        { role: { code: 'r1', status: CommonStatus.ENABLE, dataScope: DataScope.DEPT_CUSTOM, dataScopeDeptIds: [20, 30] } },
        { role: { code: 'r2', status: CommonStatus.ENABLE, dataScope: DataScope.SELF } },
      ],
    });

    const where = await service.buildUserScopeWhere(5);
    expect(where).toEqual({
      OR: [{ deptId: { in: [20, 30] } }, { id: 5 }],
    });
  });

  it('没有任何有效启用角色时应拒绝访问全部数据', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: 8,
      deptId: 10,
      roles: [],
    });

    const where = await service.buildUserScopeWhere(8);
    expect(where).toEqual({ id: -1 });
  });
});
