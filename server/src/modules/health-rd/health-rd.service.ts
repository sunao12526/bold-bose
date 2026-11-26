import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class HealthRdService {
  constructor(private prisma: PrismaService) {}

  // ================= 1. 药食同源原料库 =================
  async getMaterials(query: any) {
    const { page = 1, pageSize = 10, keyword, category, foodStatus } = query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const where: any = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { latinName: { contains: keyword, mode: 'insensitive' } },
        { traditionalEff: { contains: keyword, mode: 'insensitive' } },
        { activeComponents: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (category) where.category = category;
    if (foodStatus) where.foodStatus = foodStatus;

    if (pageSize === '-1' || Number(pageSize) === -1) {
      const data = await this.prisma.healthMaterial.findMany({ where, orderBy: { id: 'asc' } });
      return { data, total: data.length };
    }

    const [data, total] = await Promise.all([
      this.prisma.healthMaterial.findMany({ where, skip, take, orderBy: { id: 'asc' } }),
      this.prisma.healthMaterial.count({ where }),
    ]);

    return { data, total, page: Number(page), pageSize: Number(pageSize) };
  }

  async getMaterial(id: number) {
    const item = await this.prisma.healthMaterial.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('原料不存在');
    return item;
  }

  async createMaterial(data: any) {
    return this.prisma.healthMaterial.create({ data });
  }

  async updateMaterial(id: number, data: any) {
    return this.prisma.healthMaterial.update({ where: { id }, data });
  }

  async deleteMaterial(id: number) {
    return this.prisma.healthMaterial.delete({ where: { id } });
  }

  async importMaterials(items: any[]) {
    const created = await this.prisma.healthMaterial.createMany({ data: items });
    return { success: true, count: created.count };
  }

  // ================= 2. 健康功能分类 =================
  async getFunctions(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const where: any = {};
    if (keyword) {
      where.OR = [
        { categoryName: { contains: keyword, mode: 'insensitive' } },
        { rdFunction: { contains: keyword, mode: 'insensitive' } },
        { legalFunction: { contains: keyword, mode: 'insensitive' } },
        { marketingExpr: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (pageSize === '-1' || Number(pageSize) === -1) {
      const data = await this.prisma.healthFunction.findMany({ where, orderBy: { id: 'asc' } });
      return { data, total: data.length };
    }
    const [data, total] = await Promise.all([
      this.prisma.healthFunction.findMany({ where, skip, take, orderBy: { id: 'asc' } }),
      this.prisma.healthFunction.count({ where }),
    ]);
    return { data, total, page: Number(page), pageSize: Number(pageSize) };
  }

  async getFunction(id: number) {
    return this.prisma.healthFunction.findUnique({ where: { id } });
  }

  async createFunction(data: any) {
    return this.prisma.healthFunction.create({ data });
  }

  async updateFunction(id: number, data: any) {
    return this.prisma.healthFunction.update({ where: { id }, data });
  }

  async deleteFunction(id: number) {
    return this.prisma.healthFunction.delete({ where: { id } });
  }

  async importFunctions(items: any[]) {
    const created = await this.prisma.healthFunction.createMany({ data: items });
    return { success: true, count: created.count };
  }

  // ================= 3. 天然活性成分 =================
  async getIngredients(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const where: any = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { casNo: { contains: keyword, mode: 'insensitive' } },
        { sourceMaterial: { contains: keyword, mode: 'insensitive' } },
        { mechanism: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (pageSize === '-1' || Number(pageSize) === -1) {
      const data = await this.prisma.healthIngredient.findMany({ where, orderBy: { id: 'asc' } });
      return { data, total: data.length };
    }
    const [data, total] = await Promise.all([
      this.prisma.healthIngredient.findMany({ where, skip, take, orderBy: { id: 'asc' } }),
      this.prisma.healthIngredient.count({ where }),
    ]);
    return { data, total, page: Number(page), pageSize: Number(pageSize) };
  }

  async getIngredient(id: number) {
    return this.prisma.healthIngredient.findUnique({ where: { id } });
  }

  async createIngredient(data: any) {
    return this.prisma.healthIngredient.create({ data });
  }

  async updateIngredient(id: number, data: any) {
    return this.prisma.healthIngredient.update({ where: { id }, data });
  }

  async deleteIngredient(id: number) {
    return this.prisma.healthIngredient.delete({ where: { id } });
  }

  async importIngredients(items: any[]) {
    const created = await this.prisma.healthIngredient.createMany({ data: items });
    return { success: true, count: created.count };
  }

  // ================= 4. 产品配方 =================
  async getFormulas(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const where: any = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { positioning: { contains: keyword, mode: 'insensitive' } },
        { coreMaterials: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (pageSize === '-1' || Number(pageSize) === -1) {
      const data = await this.prisma.healthFormula.findMany({ where, orderBy: { id: 'asc' } });
      return { data, total: data.length };
    }
    const [data, total] = await Promise.all([
      this.prisma.healthFormula.findMany({ where, skip, take, orderBy: { id: 'asc' } }),
      this.prisma.healthFormula.count({ where }),
    ]);
    return { data, total, page: Number(page), pageSize: Number(pageSize) };
  }

  async getFormula(id: number) {
    return this.prisma.healthFormula.findUnique({ where: { id } });
  }

  async createFormula(data: any) {
    return this.prisma.healthFormula.create({ data });
  }

  async updateFormula(id: number, data: any) {
    return this.prisma.healthFormula.update({ where: { id }, data });
  }

  async deleteFormula(id: number) {
    return this.prisma.healthFormula.delete({ where: { id } });
  }

  async importFormulas(items: any[]) {
    const created = await this.prisma.healthFormula.createMany({ data: items });
    return { success: true, count: created.count };
  }

  // ================= 5. 竞品数据库 =================
  async getCompetitors(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const where: any = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { brand: { contains: keyword, mode: 'insensitive' } },
        { company: { contains: keyword, mode: 'insensitive' } },
        { mainIngredients: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (pageSize === '-1' || Number(pageSize) === -1) {
      const data = await this.prisma.healthCompetitor.findMany({ where, orderBy: { id: 'asc' } });
      return { data, total: data.length };
    }
    const [data, total] = await Promise.all([
      this.prisma.healthCompetitor.findMany({ where, skip, take, orderBy: { id: 'asc' } }),
      this.prisma.healthCompetitor.count({ where }),
    ]);
    return { data, total, page: Number(page), pageSize: Number(pageSize) };
  }

  async getCompetitor(id: number) {
    return this.prisma.healthCompetitor.findUnique({ where: { id } });
  }

  async createCompetitor(data: any) {
    return this.prisma.healthCompetitor.create({ data });
  }

  async updateCompetitor(id: number, data: any) {
    return this.prisma.healthCompetitor.update({ where: { id }, data });
  }

  async deleteCompetitor(id: number) {
    return this.prisma.healthCompetitor.delete({ where: { id } });
  }

  async importCompetitors(items: any[]) {
    const created = await this.prisma.healthCompetitor.createMany({ data: items });
    return { success: true, count: created.count };
  }

  // ================= 6. 文献证据库 =================
  async getLiteratures(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const where: any = {};
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { material: { contains: keyword, mode: 'insensitive' } },
        { authors: { contains: keyword, mode: 'insensitive' } },
        { journal: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (pageSize === '-1' || Number(pageSize) === -1) {
      const data = await this.prisma.healthLiterature.findMany({ where, orderBy: { id: 'asc' } });
      return { data, total: data.length };
    }
    const [data, total] = await Promise.all([
      this.prisma.healthLiterature.findMany({ where, skip, take, orderBy: { id: 'asc' } }),
      this.prisma.healthLiterature.count({ where }),
    ]);
    return { data, total, page: Number(page), pageSize: Number(pageSize) };
  }

  async getLiterature(id: number) {
    return this.prisma.healthLiterature.findUnique({ where: { id } });
  }

  async createLiterature(data: any) {
    return this.prisma.healthLiterature.create({ data });
  }

  async updateLiterature(id: number, data: any) {
    return this.prisma.healthLiterature.update({ where: { id }, data });
  }

  async deleteLiterature(id: number) {
    return this.prisma.healthLiterature.delete({ where: { id } });
  }

  async importLiteratures(items: any[]) {
    const created = await this.prisma.healthLiterature.createMany({ data: items });
    return { success: true, count: created.count };
  }

  // ================= 7. 专利数据库 =================
  async getPatents(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const where: any = {};
    if (keyword) {
      where.OR = [
        { patentNo: { contains: keyword, mode: 'insensitive' } },
        { title: { contains: keyword, mode: 'insensitive' } },
        { applicant: { contains: keyword, mode: 'insensitive' } },
        { materials: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (pageSize === '-1' || Number(pageSize) === -1) {
      const data = await this.prisma.healthPatent.findMany({ where, orderBy: { id: 'asc' } });
      return { data, total: data.length };
    }
    const [data, total] = await Promise.all([
      this.prisma.healthPatent.findMany({ where, skip, take, orderBy: { id: 'asc' } }),
      this.prisma.healthPatent.count({ where }),
    ]);
    return { data, total, page: Number(page), pageSize: Number(pageSize) };
  }

  async getPatent(id: number) {
    return this.prisma.healthPatent.findUnique({ where: { id } });
  }

  async createPatent(data: any) {
    return this.prisma.healthPatent.create({ data });
  }

  async updatePatent(id: number, data: any) {
    return this.prisma.healthPatent.update({ where: { id }, data });
  }

  async deletePatent(id: number) {
    return this.prisma.healthPatent.delete({ where: { id } });
  }

  async importPatents(items: any[]) {
    const created = await this.prisma.healthPatent.createMany({ data: items });
    return { success: true, count: created.count };
  }

  // ================= 8. 质量标准库 =================
  async getQualityStandards(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const where: any = {};
    if (keyword) {
      where.OR = [
        { materialName: { contains: keyword, mode: 'insensitive' } },
        { testItem: { contains: keyword, mode: 'insensitive' } },
        { testMethod: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (pageSize === '-1' || Number(pageSize) === -1) {
      const data = await this.prisma.healthQualityStandard.findMany({ where, orderBy: { id: 'asc' } });
      return { data, total: data.length };
    }
    const [data, total] = await Promise.all([
      this.prisma.healthQualityStandard.findMany({ where, skip, take, orderBy: { id: 'asc' } }),
      this.prisma.healthQualityStandard.count({ where }),
    ]);
    return { data, total, page: Number(page), pageSize: Number(pageSize) };
  }

  async getQualityStandard(id: number) {
    return this.prisma.healthQualityStandard.findUnique({ where: { id } });
  }

  async createQualityStandard(data: any) {
    return this.prisma.healthQualityStandard.create({ data });
  }

  async updateQualityStandard(id: number, data: any) {
    return this.prisma.healthQualityStandard.update({ where: { id }, data });
  }

  async deleteQualityStandard(id: number) {
    return this.prisma.healthQualityStandard.delete({ where: { id } });
  }

  async importQualityStandards(items: any[]) {
    const created = await this.prisma.healthQualityStandard.createMany({ data: items });
    return { success: true, count: created.count };
  }

  // ================= 9. 工艺技术库 =================
  async getProcesses(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const where: any = {};
    if (keyword) {
      where.OR = [
        { materialName: { contains: keyword, mode: 'insensitive' } },
        { targetComponent: { contains: keyword, mode: 'insensitive' } },
        { solvent: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (pageSize === '-1' || Number(pageSize) === -1) {
      const data = await this.prisma.healthProcess.findMany({ where, orderBy: { id: 'asc' } });
      return { data, total: data.length };
    }
    const [data, total] = await Promise.all([
      this.prisma.healthProcess.findMany({ where, skip, take, orderBy: { id: 'asc' } }),
      this.prisma.healthProcess.count({ where }),
    ]);
    return { data, total, page: Number(page), pageSize: Number(pageSize) };
  }

  async getProcess(id: number) {
    return this.prisma.healthProcess.findUnique({ where: { id } });
  }

  async createProcess(data: any) {
    return this.prisma.healthProcess.create({ data });
  }

  async updateProcess(id: number, data: any) {
    return this.prisma.healthProcess.update({ where: { id }, data });
  }

  async deleteProcess(id: number) {
    return this.prisma.healthProcess.delete({ where: { id } });
  }

  async importProcesses(items: any[]) {
    const created = await this.prisma.healthProcess.createMany({ data: items });
    return { success: true, count: created.count };
  }

  // ================= 10. 供应链数据库 =================
  async getSuppliers(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const where: any = {};
    if (keyword) {
      where.OR = [
        { materialName: { contains: keyword, mode: 'insensitive' } },
        { supplierName: { contains: keyword, mode: 'insensitive' } },
        { origin: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (pageSize === '-1' || Number(pageSize) === -1) {
      const data = await this.prisma.healthSupplier.findMany({ where, orderBy: { id: 'asc' } });
      return { data, total: data.length };
    }
    const [data, total] = await Promise.all([
      this.prisma.healthSupplier.findMany({ where, skip, take, orderBy: { id: 'asc' } }),
      this.prisma.healthSupplier.count({ where }),
    ]);
    return { data, total, page: Number(page), pageSize: Number(pageSize) };
  }

  async getSupplier(id: number) {
    return this.prisma.healthSupplier.findUnique({ where: { id } });
  }

  async createSupplier(data: any) {
    return this.prisma.healthSupplier.create({ data });
  }

  async updateSupplier(id: number, data: any) {
    return this.prisma.healthSupplier.update({ where: { id }, data });
  }

  async deleteSupplier(id: number) {
    return this.prisma.healthSupplier.delete({ where: { id } });
  }

  async importSuppliers(items: any[]) {
    const created = await this.prisma.healthSupplier.createMany({ data: items });
    return { success: true, count: created.count };
  }

  // ================= 11. AI知识标签库 =================
  async getAiTags(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const where: any = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { category: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (pageSize === '-1' || Number(pageSize) === -1) {
      const data = await this.prisma.healthAiTag.findMany({ where, orderBy: { id: 'asc' } });
      return { data, total: data.length };
    }
    const [data, total] = await Promise.all([
      this.prisma.healthAiTag.findMany({ where, skip, take, orderBy: { id: 'asc' } }),
      this.prisma.healthAiTag.count({ where }),
    ]);
    return { data, total, page: Number(page), pageSize: Number(pageSize) };
  }

  async getAiTag(id: number) {
    return this.prisma.healthAiTag.findUnique({ where: { id } });
  }

  async createAiTag(data: any) {
    return this.prisma.healthAiTag.create({ data });
  }

  async updateAiTag(id: number, data: any) {
    return this.prisma.healthAiTag.update({ where: { id }, data });
  }

  async deleteAiTag(id: number) {
    return this.prisma.healthAiTag.delete({ where: { id } });
  }

  async importAiTags(items: any[]) {
    const created = await this.prisma.healthAiTag.createMany({ data: items });
    return { success: true, count: created.count };
  }

  // ================= 12. 产品生命周期 =================
  async getProductLifecycles(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const where: any = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { stage: { contains: keyword, mode: 'insensitive' } },
        { owner: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (pageSize === '-1' || Number(pageSize) === -1) {
      const data = await this.prisma.healthProductLifecycle.findMany({ where, orderBy: { id: 'asc' } });
      return { data, total: data.length };
    }
    const [data, total] = await Promise.all([
      this.prisma.healthProductLifecycle.findMany({ where, skip, take, orderBy: { id: 'asc' } }),
      this.prisma.healthProductLifecycle.count({ where }),
    ]);
    return { data, total, page: Number(page), pageSize: Number(pageSize) };
  }

  async getProductLifecycle(id: number) {
    return this.prisma.healthProductLifecycle.findUnique({ where: { id } });
  }

  async createProductLifecycle(data: any) {
    return this.prisma.healthProductLifecycle.create({ data });
  }

  async updateProductLifecycle(id: number, data: any) {
    return this.prisma.healthProductLifecycle.update({ where: { id }, data });
  }

  async deleteProductLifecycle(id: number) {
    return this.prisma.healthProductLifecycle.delete({ where: { id } });
  }

  async importProductLifecycles(items: any[]) {
    const created = await this.prisma.healthProductLifecycle.createMany({ data: items });
    return { success: true, count: created.count };
  }

  // ================= 13. 作用靶点数据库 =================
  async getTargets(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const where: any = {};
    if (keyword) {
      where.OR = [
        { activeIngredient: { contains: keyword, mode: 'insensitive' } },
        { targetName: { contains: keyword, mode: 'insensitive' } },
        { diseaseDomain: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (pageSize === '-1' || Number(pageSize) === -1) {
      const data = await this.prisma.healthTarget.findMany({ where, orderBy: { id: 'asc' } });
      return { data, total: data.length };
    }
    const [data, total] = await Promise.all([
      this.prisma.healthTarget.findMany({ where, skip, take, orderBy: { id: 'asc' } }),
      this.prisma.healthTarget.count({ where }),
    ]);
    return { data, total, page: Number(page), pageSize: Number(pageSize) };
  }

  async getTarget(id: number) {
    return this.prisma.healthTarget.findUnique({ where: { id } });
  }

  async createTarget(data: any) {
    return this.prisma.healthTarget.create({ data });
  }

  async updateTarget(id: number, data: any) {
    return this.prisma.healthTarget.update({ where: { id }, data });
  }

  async deleteTarget(id: number) {
    return this.prisma.healthTarget.delete({ where: { id } });
  }

  async importTargets(items: any[]) {
    const created = await this.prisma.healthTarget.createMany({ data: items });
    return { success: true, count: created.count };
  }

  // ================= 14. 法规知识库 =================
  async getRegulations(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const where: any = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { publisher: { contains: keyword, mode: 'insensitive' } },
        { restrictions: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (pageSize === '-1' || Number(pageSize) === -1) {
      const data = await this.prisma.healthRegulation.findMany({ where, orderBy: { id: 'asc' } });
      return { data, total: data.length };
    }
    const [data, total] = await Promise.all([
      this.prisma.healthRegulation.findMany({ where, skip, take, orderBy: { id: 'asc' } }),
      this.prisma.healthRegulation.count({ where }),
    ]);
    return { data, total, page: Number(page), pageSize: Number(pageSize) };
  }

  async getRegulation(id: number) {
    return this.prisma.healthRegulation.findUnique({ where: { id } });
  }

  async createRegulation(data: any) {
    return this.prisma.healthRegulation.create({ data });
  }

  async updateRegulation(id: number, data: any) {
    return this.prisma.healthRegulation.update({ where: { id }, data });
  }

  async deleteRegulation(id: number) {
    return this.prisma.healthRegulation.delete({ where: { id } });
  }

  async importRegulations(items: any[]) {
    const created = await this.prisma.healthRegulation.createMany({ data: items });
    return { success: true, count: created.count };
  }

  // ================= 15. 检测方法数据库 =================
  async getTestMethods(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const where: any = {};
    if (keyword) {
      where.OR = [
        { materialName: { contains: keyword, mode: 'insensitive' } },
        { testItem: { contains: keyword, mode: 'insensitive' } },
        { testMethod: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (pageSize === '-1' || Number(pageSize) === -1) {
      const data = await this.prisma.healthTestMethod.findMany({ where, orderBy: { id: 'asc' } });
      return { data, total: data.length };
    }
    const [data, total] = await Promise.all([
      this.prisma.healthTestMethod.findMany({ where, skip, take, orderBy: { id: 'asc' } }),
      this.prisma.healthTestMethod.count({ where }),
    ]);
    return { data, total, page: Number(page), pageSize: Number(pageSize) };
  }

  async getTestMethod(id: number) {
    return this.prisma.healthTestMethod.findUnique({ where: { id } });
  }

  async createTestMethod(data: any) {
    return this.prisma.healthTestMethod.create({ data });
  }

  async updateTestMethod(id: number, data: any) {
    return this.prisma.healthTestMethod.update({ where: { id }, data });
  }

  async deleteTestMethod(id: number) {
    return this.prisma.healthTestMethod.delete({ where: { id } });
  }

  async importTestMethods(items: any[]) {
    const created = await this.prisma.healthTestMethod.createMany({ data: items });
    return { success: true, count: created.count };
  }

  // 统计概览数据 API
  async getDashboardSummary() {
    const [
      materialCount,
      functionCount,
      ingredientCount,
      formulaCount,
      competitorCount,
      literatureCount,
      patentCount,
      supplierCount,
      targetCount,
      regulationCount,
    ] = await Promise.all([
      this.prisma.healthMaterial.count(),
      this.prisma.healthFunction.count(),
      this.prisma.healthIngredient.count(),
      this.prisma.healthFormula.count(),
      this.prisma.healthCompetitor.count(),
      this.prisma.healthLiterature.count(),
      this.prisma.healthPatent.count(),
      this.prisma.healthSupplier.count(),
      this.prisma.healthTarget.count(),
      this.prisma.healthRegulation.count(),
    ]);

    return {
      materialCount,
      functionCount,
      ingredientCount,
      formulaCount,
      competitorCount,
      literatureCount,
      patentCount,
      supplierCount,
      targetCount,
      regulationCount,
    };
  }
}
