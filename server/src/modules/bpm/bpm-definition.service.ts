import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommonStatus } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { paginateQuery } from '../../shared/pagination';

@Injectable()
export class BpmDefinitionService {
  constructor(private readonly prisma: PrismaService) {}

  // ================= Category =================

  async findAllCategories(query?: any) {
    const where: any = {};
    if (query?.name) where.name = { contains: query.name };
    if (query?.code) where.code = { contains: query.code };
    if (query?.status) where.status = query.status;

    return paginateQuery(this.prisma, 'bpmCategory', query || {}, {
      where,
      orderBy: [{ sort: 'asc' }, { id: 'desc' }],
    });
  }

  async findSimpleCategories() {
    return this.prisma.bpmCategory.findMany({
      where: { status: CommonStatus.ENABLE },
      select: { id: true, name: true, code: true },
      orderBy: { sort: 'asc' },
    });
  }

  async createCategory(data: any) {
    const existing = await this.prisma.bpmCategory.findUnique({
      where: { code: data.code },
    });
    if (existing) throw new BadRequestException(`分类编码 [${data.code}] 已存在`);
    return this.prisma.bpmCategory.create({ data });
  }

  async updateCategory(id: number, data: any) {
    const existing = await this.prisma.bpmCategory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('流程分类不存在');
    return this.prisma.bpmCategory.update({ where: { id }, data });
  }

  async removeCategory(id: number) {
    const existing = await this.prisma.bpmCategory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('流程分类不存在');
    return this.prisma.bpmCategory.delete({ where: { id } });
  }

  // ================= Form =================

  async findAllForms(query?: any) {
    const where: any = {};
    if (query?.name) where.name = { contains: query.name };
    if (query?.status) where.status = query.status;

    return paginateQuery(this.prisma, 'bpmForm', query || {}, {
      where,
      orderBy: { id: 'desc' },
    });
  }

  async findOneForm(id: number) {
    const form = await this.prisma.bpmForm.findUnique({ where: { id } });
    if (!form) throw new NotFoundException('动态表单不存在');
    return form;
  }

  async createForm(data: any) {
    return this.prisma.bpmForm.create({ data });
  }

  async updateForm(id: number, data: any) {
    await this.findOneForm(id);
    return this.prisma.bpmForm.update({ where: { id }, data });
  }

  async removeForm(id: number) {
    await this.findOneForm(id);
    return this.prisma.bpmForm.delete({ where: { id } });
  }

  // ================= Model =================

  async findAllModels(query?: any) {
    const where: any = {};
    if (query?.key) where.key = { contains: query.key };
    if (query?.name) where.name = { contains: query.name };
    if (query?.categoryCode) where.categoryCode = query.categoryCode;
    if (query?.status) where.status = query.status;

    return paginateQuery(this.prisma, 'bpmModel', query || {}, {
      where,
      orderBy: { id: 'desc' },
    });
  }

  async findOneModel(id: number) {
    const model = await this.prisma.bpmModel.findUnique({ where: { id } });
    if (!model) throw new NotFoundException('流程模型不存在');
    return model;
  }

  async createModel(data: any) {
    const existing = await this.prisma.bpmModel.findUnique({
      where: { key: data.key },
    });
    if (existing) throw new BadRequestException(`流程标识 [${data.key}] 已存在`);
    return this.prisma.bpmModel.create({ data });
  }

  async updateModel(id: number, data: any) {
    await this.findOneModel(id);
    return this.prisma.bpmModel.update({ where: { id }, data });
  }

  async deployModel(id: number) {
    const model = await this.findOneModel(id);
    return this.prisma.bpmModel.update({
      where: { id },
      data: {
        deployed: true,
        version: model.deployed ? model.version + 1 : model.version,
      },
    });
  }

  async removeModel(id: number) {
    await this.findOneModel(id);
    return this.prisma.bpmModel.delete({ where: { id } });
  }
}
