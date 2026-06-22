import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ConfigService', () => {
  let service: ConfigService;

  const mockPrismaService = {
    sysConfig: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('应该抛出异常：若 key 已存在', async () => {
      mockPrismaService.sysConfig.findUnique.mockResolvedValue({ id: 1, key: 'test.key' });

      await expect(service.create({ key: 'test.key', value: '123' })).rejects.toThrow(
        new BadRequestException('配置键名已存在'),
      );
    });

    it('应该正常创建：若 key 不存在', async () => {
      mockPrismaService.sysConfig.findUnique.mockResolvedValue(null);
      mockPrismaService.sysConfig.create.mockResolvedValue({ id: 2, key: 'test.key', value: '123' });

      const res = await service.create({ key: 'test.key', value: '123' });
      expect(res.id).toBe(2);
      expect(mockPrismaService.sysConfig.create).toHaveBeenCalledWith({
        data: { key: 'test.key', value: '123' },
      });
    });
  });

  describe('findAll', () => {
    it('应该返回所有配置项', async () => {
      mockPrismaService.sysConfig.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      const res = await service.findAll();
      expect(res.length).toBe(2);
      expect(mockPrismaService.sysConfig.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('若 ID 匹配的配置项不存在，应该抛出 NotFoundException', async () => {
      mockPrismaService.sysConfig.findUnique.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('配置项不存在'),
      );
    });

    it('若配置存在，应该返回该配置', async () => {
      const mockConfig = { id: 1, key: 'some' };
      mockPrismaService.sysConfig.findUnique.mockResolvedValue(mockConfig);
      const res = await service.findOne(1);
      expect(res).toEqual(mockConfig);
    });
  });

  describe('findByKey', () => {
    it('若 Key 匹配的配置项不存在，应该抛出 NotFoundException', async () => {
      mockPrismaService.sysConfig.findUnique.mockResolvedValue(null);
      await expect(service.findByKey('none')).rejects.toThrow(
        new NotFoundException('配置键名 none 不存在'),
      );
    });

    it('若配置存在，应该返回该配置', async () => {
      const mockConfig = { id: 1, key: 'some' };
      mockPrismaService.sysConfig.findUnique.mockResolvedValue(mockConfig);
      const res = await service.findByKey('some');
      expect(res).toEqual(mockConfig);
    });
  });

  describe('update', () => {
    it('如果修改后的 key 冲突，应该抛出 BadRequestException', async () => {
      mockPrismaService.sysConfig.findUnique.mockResolvedValue({ id: 1, key: 'old.key' });
      mockPrismaService.sysConfig.findFirst.mockResolvedValue({ id: 2, key: 'new.key' });

      await expect(service.update(1, { key: 'new.key' })).rejects.toThrow(
        new BadRequestException('配置键名已存在'),
      );
    });

    it('应该更新成功：如果新 key 没有冲突或者没有传入新 key', async () => {
      mockPrismaService.sysConfig.findUnique.mockResolvedValue({ id: 1, key: 'old.key' });
      mockPrismaService.sysConfig.findFirst.mockResolvedValue(null);
      mockPrismaService.sysConfig.update.mockResolvedValue({ id: 1, key: 'new.key', value: '456' });

      const res = await service.update(1, { key: 'new.key', value: '456' });
      expect(res.key).toBe('new.key');
      expect(mockPrismaService.sysConfig.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { key: 'new.key', value: '456' },
      });
    });
  });

  describe('remove', () => {
    it('应该先找是否存在，再进行删除', async () => {
      mockPrismaService.sysConfig.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.sysConfig.delete.mockResolvedValue({ id: 1 });

      const res = await service.remove(1);
      expect(res.id).toBe(1);
      expect(mockPrismaService.sysConfig.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
