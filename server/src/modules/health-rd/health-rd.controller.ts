import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { HealthRdService } from './health-rd.service';

@ApiTags('大健康研发知识平台 (药食同源)')
@Controller('health-rd')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class HealthRdController {
  constructor(private readonly healthRdService: HealthRdService) {}

  @Get('dashboard/summary')
  @ApiOperation({ summary: '大健康研发知识平台统计数据概览' })
  getDashboardSummary() {
    return this.healthRdService.getDashboardSummary();
  }

  // 1. 药食同源原料
  @Get('material')
  getMaterials(@Query() query: any) {
    return this.healthRdService.getMaterials(query);
  }

  @Get('material/:id')
  getMaterial(@Param('id') id: string) {
    return this.healthRdService.getMaterial(Number(id));
  }

  @Post('material')
  createMaterial(@Body() data: any) {
    return this.healthRdService.createMaterial(data);
  }

  @Put('material/:id')
  updateMaterial(@Param('id') id: string, @Body() data: any) {
    return this.healthRdService.updateMaterial(Number(id), data);
  }

  @Delete('material/:id')
  deleteMaterial(@Param('id') id: string) {
    return this.healthRdService.deleteMaterial(Number(id));
  }

  @Post('material/import')
  importMaterials(@Body() body: { items: any[] }) {
    return this.healthRdService.importMaterials(body.items || []);
  }

  // 2. 健康功能分类
  @Get('function')
  getFunctions(@Query() query: any) {
    return this.healthRdService.getFunctions(query);
  }

  @Get('function/:id')
  getFunction(@Param('id') id: string) {
    return this.healthRdService.getFunction(Number(id));
  }

  @Post('function')
  createFunction(@Body() data: any) {
    return this.healthRdService.createFunction(data);
  }

  @Put('function/:id')
  updateFunction(@Param('id') id: string, @Body() data: any) {
    return this.healthRdService.updateFunction(Number(id), data);
  }

  @Delete('function/:id')
  deleteFunction(@Param('id') id: string) {
    return this.healthRdService.deleteFunction(Number(id));
  }

  @Post('function/import')
  importFunctions(@Body() body: { items: any[] }) {
    return this.healthRdService.importFunctions(body.items || []);
  }

  // 3. 天然活性成分
  @Get('ingredient')
  getIngredients(@Query() query: any) {
    return this.healthRdService.getIngredients(query);
  }

  @Get('ingredient/:id')
  getIngredient(@Param('id') id: string) {
    return this.healthRdService.getIngredient(Number(id));
  }

  @Post('ingredient')
  createIngredient(@Body() data: any) {
    return this.healthRdService.createIngredient(data);
  }

  @Put('ingredient/:id')
  updateIngredient(@Param('id') id: string, @Body() data: any) {
    return this.healthRdService.updateIngredient(Number(id), data);
  }

  @Delete('ingredient/:id')
  deleteIngredient(@Param('id') id: string) {
    return this.healthRdService.deleteIngredient(Number(id));
  }

  @Post('ingredient/import')
  importIngredients(@Body() body: { items: any[] }) {
    return this.healthRdService.importIngredients(body.items || []);
  }

  // 4. 产品配方
  @Get('formula')
  getFormulas(@Query() query: any) {
    return this.healthRdService.getFormulas(query);
  }

  @Get('formula/:id')
  getFormula(@Param('id') id: string) {
    return this.healthRdService.getFormula(Number(id));
  }

  @Post('formula')
  createFormula(@Body() data: any) {
    return this.healthRdService.createFormula(data);
  }

  @Put('formula/:id')
  updateFormula(@Param('id') id: string, @Body() data: any) {
    return this.healthRdService.updateFormula(Number(id), data);
  }

  @Delete('formula/:id')
  deleteFormula(@Param('id') id: string) {
    return this.healthRdService.deleteFormula(Number(id));
  }

  @Post('formula/import')
  importFormulas(@Body() body: { items: any[] }) {
    return this.healthRdService.importFormulas(body.items || []);
  }

  // 5. 竞品数据库
  @Get('competitor')
  getCompetitors(@Query() query: any) {
    return this.healthRdService.getCompetitors(query);
  }

  @Get('competitor/:id')
  getCompetitor(@Param('id') id: string) {
    return this.healthRdService.getCompetitor(Number(id));
  }

  @Post('competitor')
  createCompetitor(@Body() data: any) {
    return this.healthRdService.createCompetitor(data);
  }

  @Put('competitor/:id')
  updateCompetitor(@Param('id') id: string, @Body() data: any) {
    return this.healthRdService.updateCompetitor(Number(id), data);
  }

  @Delete('competitor/:id')
  deleteCompetitor(@Param('id') id: string) {
    return this.healthRdService.deleteCompetitor(Number(id));
  }

  @Post('competitor/import')
  importCompetitors(@Body() body: { items: any[] }) {
    return this.healthRdService.importCompetitors(body.items || []);
  }

  // 6. 文献证据库
  @Get('literature')
  getLiteratures(@Query() query: any) {
    return this.healthRdService.getLiteratures(query);
  }

  @Get('literature/:id')
  getLiterature(@Param('id') id: string) {
    return this.healthRdService.getLiterature(Number(id));
  }

  @Post('literature')
  createLiterature(@Body() data: any) {
    return this.healthRdService.createLiterature(data);
  }

  @Put('literature/:id')
  updateLiterature(@Param('id') id: string, @Body() data: any) {
    return this.healthRdService.updateLiterature(Number(id), data);
  }

  @Delete('literature/:id')
  deleteLiterature(@Param('id') id: string) {
    return this.healthRdService.deleteLiterature(Number(id));
  }

  @Post('literature/import')
  importLiteratures(@Body() body: { items: any[] }) {
    return this.healthRdService.importLiteratures(body.items || []);
  }

  // 7. 专利数据库
  @Get('patent')
  getPatents(@Query() query: any) {
    return this.healthRdService.getPatents(query);
  }

  @Get('patent/:id')
  getPatent(@Param('id') id: string) {
    return this.healthRdService.getPatent(Number(id));
  }

  @Post('patent')
  createPatent(@Body() data: any) {
    return this.healthRdService.createPatent(data);
  }

  @Put('patent/:id')
  updatePatent(@Param('id') id: string, @Body() data: any) {
    return this.healthRdService.updatePatent(Number(id), data);
  }

  @Delete('patent/:id')
  deletePatent(@Param('id') id: string) {
    return this.healthRdService.deletePatent(Number(id));
  }

  @Post('patent/import')
  importPatents(@Body() body: { items: any[] }) {
    return this.healthRdService.importPatents(body.items || []);
  }

  // 8. 质量标准库
  @Get('quality-standard')
  getQualityStandards(@Query() query: any) {
    return this.healthRdService.getQualityStandards(query);
  }

  @Get('quality-standard/:id')
  getQualityStandard(@Param('id') id: string) {
    return this.healthRdService.getQualityStandard(Number(id));
  }

  @Post('quality-standard')
  createQualityStandard(@Body() data: any) {
    return this.healthRdService.createQualityStandard(data);
  }

  @Put('quality-standard/:id')
  updateQualityStandard(@Param('id') id: string, @Body() data: any) {
    return this.healthRdService.updateQualityStandard(Number(id), data);
  }

  @Delete('quality-standard/:id')
  deleteQualityStandard(@Param('id') id: string) {
    return this.healthRdService.deleteQualityStandard(Number(id));
  }

  // 9. 工艺技术库
  @Get('process')
  getProcesses(@Query() query: any) {
    return this.healthRdService.getProcesses(query);
  }

  @Get('process/:id')
  getProcess(@Param('id') id: string) {
    return this.healthRdService.getProcess(Number(id));
  }

  @Post('process')
  createProcess(@Body() data: any) {
    return this.healthRdService.createProcess(data);
  }

  @Put('process/:id')
  updateProcess(@Param('id') id: string, @Body() data: any) {
    return this.healthRdService.updateProcess(Number(id), data);
  }

  @Delete('process/:id')
  deleteProcess(@Param('id') id: string) {
    return this.healthRdService.deleteProcess(Number(id));
  }

  // 10. 供应链数据库
  @Get('supplier')
  getSuppliers(@Query() query: any) {
    return this.healthRdService.getSuppliers(query);
  }

  @Get('supplier/:id')
  getSupplier(@Param('id') id: string) {
    return this.healthRdService.getSupplier(Number(id));
  }

  @Post('supplier')
  createSupplier(@Body() data: any) {
    return this.healthRdService.createSupplier(data);
  }

  @Put('supplier/:id')
  updateSupplier(@Param('id') id: string, @Body() data: any) {
    return this.healthRdService.updateSupplier(Number(id), data);
  }

  @Delete('supplier/:id')
  deleteSupplier(@Param('id') id: string) {
    return this.healthRdService.deleteSupplier(Number(id));
  }

  // 11. AI知识标签库
  @Get('ai-tag')
  getAiTags(@Query() query: any) {
    return this.healthRdService.getAiTags(query);
  }

  @Get('ai-tag/:id')
  getAiTag(@Param('id') id: string) {
    return this.healthRdService.getAiTag(Number(id));
  }

  @Post('ai-tag')
  createAiTag(@Body() data: any) {
    return this.healthRdService.createAiTag(data);
  }

  @Put('ai-tag/:id')
  updateAiTag(@Param('id') id: string, @Body() data: any) {
    return this.healthRdService.updateAiTag(Number(id), data);
  }

  @Delete('ai-tag/:id')
  deleteAiTag(@Param('id') id: string) {
    return this.healthRdService.deleteAiTag(Number(id));
  }

  // 12. 产品生命周期
  @Get('product-lifecycle')
  getProductLifecycles(@Query() query: any) {
    return this.healthRdService.getProductLifecycles(query);
  }

  @Get('product-lifecycle/:id')
  getProductLifecycle(@Param('id') id: string) {
    return this.healthRdService.getProductLifecycle(Number(id));
  }

  @Post('product-lifecycle')
  createProductLifecycle(@Body() data: any) {
    return this.healthRdService.createProductLifecycle(data);
  }

  @Put('product-lifecycle/:id')
  updateProductLifecycle(@Param('id') id: string, @Body() data: any) {
    return this.healthRdService.updateProductLifecycle(Number(id), data);
  }

  @Delete('product-lifecycle/:id')
  deleteProductLifecycle(@Param('id') id: string) {
    return this.healthRdService.deleteProductLifecycle(Number(id));
  }

  // 13. 作用靶点数据库
  @Get('target')
  getTargets(@Query() query: any) {
    return this.healthRdService.getTargets(query);
  }

  @Get('target/:id')
  getTarget(@Param('id') id: string) {
    return this.healthRdService.getTarget(Number(id));
  }

  @Post('target')
  createTarget(@Body() data: any) {
    return this.healthRdService.createTarget(data);
  }

  @Put('target/:id')
  updateTarget(@Param('id') id: string, @Body() data: any) {
    return this.healthRdService.updateTarget(Number(id), data);
  }

  @Delete('target/:id')
  deleteTarget(@Param('id') id: string) {
    return this.healthRdService.deleteTarget(Number(id));
  }

  @Post('target/import')
  importTargets(@Body() body: { items: any[] }) {
    return this.healthRdService.importTargets(body.items || []);
  }

  // 14. 法规知识库
  @Get('regulation')
  getRegulations(@Query() query: any) {
    return this.healthRdService.getRegulations(query);
  }

  @Get('regulation/:id')
  getRegulation(@Param('id') id: string) {
    return this.healthRdService.getRegulation(Number(id));
  }

  @Post('regulation')
  createRegulation(@Body() data: any) {
    return this.healthRdService.createRegulation(data);
  }

  @Put('regulation/:id')
  updateRegulation(@Param('id') id: string, @Body() data: any) {
    return this.healthRdService.updateRegulation(Number(id), data);
  }

  @Delete('regulation/:id')
  deleteRegulation(@Param('id') id: string) {
    return this.healthRdService.deleteRegulation(Number(id));
  }

  // 15. 检测方法数据库
  @Get('test-method')
  getTestMethods(@Query() query: any) {
    return this.healthRdService.getTestMethods(query);
  }

  @Get('test-method/:id')
  getTestMethod(@Param('id') id: string) {
    return this.healthRdService.getTestMethod(Number(id));
  }

  @Post('test-method')
  createTestMethod(@Body() data: any) {
    return this.healthRdService.createTestMethod(data);
  }

  @Put('test-method/:id')
  updateTestMethod(@Param('id') id: string, @Body() data: any) {
    return this.healthRdService.updateTestMethod(Number(id), data);
  }

  @Delete('test-method/:id')
  deleteTestMethod(@Param('id') id: string) {
    return this.healthRdService.deleteTestMethod(Number(id));
  }
}
