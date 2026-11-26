import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as XLSX from 'xlsx';
import * as path from 'path';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedHealthData() {
  console.log('🌱 开始导入大健康研发知识平台 (药食同源) 数据...');

  const excelPath = path.join(__dirname, '../../大健康研发知识平台V4.0.xlsx');
  const wb = XLSX.readFile(excelPath);

  // 1. 药食同源原料库 (Sheet 1)
  const sheet1 = wb.Sheets['1-药食同源原料库'];
  if (sheet1) {
    const rows: any[] = XLSX.utils.sheet_to_json(sheet1, { header: 1 });
    let dataRows = rows.slice(3);
    if (dataRows.length > 0 && (String(dataRows[0][0]).includes('序号') || String(dataRows[0][1]).includes('原料名称'))) {
      dataRows = dataRows.slice(1);
    }
    
    await prisma.healthMaterial.deleteMany({});
    for (const row of dataRows) {
      if (!row || !row[1]) continue;
      await prisma.healthMaterial.create({
        data: {
          code: String(row[0] || ''),
          name: String(row[1] || ''),
          latinName: String(row[2] || ''),
          pinyin: String(row[3] || ''),
          category: String(row[4] || ''),
          source: String(row[5] || ''),
          originRegion: String(row[6] || ''),
          medicinalParts: String(row[7] || ''),
          flavorProperty: String(row[8] || ''),
          traditionalEff: String(row[9] || ''),
          modernResearch: String(row[10] || ''),
          activeComponents: String(row[11] || ''),
          safetyDose: String(row[12] || ''),
          foodStatus: String(row[13] || ''),
          regulatoryLimit: String(row[14] || ''),
          priceGrade: String(row[15] || ''),
          remark: String(row[16] || ''),
        },
      });
    }
    console.log('✅ 药食同源原料库 导入完成');
  }

  // 2. 健康功能分类 (Sheet 2)
  const sheet2 = wb.Sheets['2-健康功能分类'];
  if (sheet2) {
    const rows: any[] = XLSX.utils.sheet_to_json(sheet2, { header: 1 });
    let dataRows = rows.slice(1);
    if (dataRows.length > 0 && (String(dataRows[0][0]).includes('序号') || String(dataRows[0][0]).includes('编号'))) {
      dataRows = dataRows.slice(1);
    }
    await prisma.healthFunction.deleteMany({});
    for (const row of dataRows) {
      if (!row || !row[1]) continue;
      await prisma.healthFunction.create({
        data: {
          code: String(row[0] || ''),
          categoryName: String(row[1] || ''),
          rdFunction: String(row[2] || ''),
          legalFunction: String(row[3] || ''),
          marketingExpr: String(row[4] || ''),
          legalClaim: String(row[5] || ''),
          sceneNormalFood: String(row[6] || ''),
          sceneHealthFood: String(row[7] || ''),
          relatedMaterials: String(row[8] || ''),
          relatedIngredients: String(row[9] || ''),
          typicalDirection: String(row[10] || ''),
          riskWarning: String(row[11] || ''),
        },
      });
    }
    console.log('✅ 健康功能分类 导入完成');
  }

  // 3. 天然活性成分库 (Sheet 3)
  const sheet3 = wb.Sheets['3-天然活性成分库'];
  if (sheet3) {
    const rows: any[] = XLSX.utils.sheet_to_json(sheet3, { header: 1 });
    let dataRows = rows.slice(1);
    if (dataRows.length > 0 && (String(dataRows[0][0]).includes('序号') || String(dataRows[0][1]).includes('成分名称'))) {
      dataRows = dataRows.slice(1);
    }
    await prisma.healthIngredient.deleteMany({});
    for (const row of dataRows) {
      if (!row || !row[1]) continue;
      await prisma.healthIngredient.create({
        data: {
          name: String(row[1] || ''),
          casNo: String(row[2] || ''),
          sourceMaterial: String(row[3] || ''),
          category: String(row[4] || ''),
          chemCategory: String(row[5] || ''),
          researchDir: String(row[6] || ''),
          mechanism: String(row[7] || ''),
          evidenceLevel: String(row[8] || ''),
          clinicalEvidence: String(row[9] || ''),
          paperCount: parseInt(String(row[10] || '0')) || 0,
          formulaStructure: String(row[11] || ''),
        },
      });
    }
    console.log('✅ 天然活性成分库 导入完成');
  }

  // 4. 产品配方库 (Sheet 4)
  const sheet4 = wb.Sheets['4-产品配方库'];
  if (sheet4) {
    const rows: any[] = XLSX.utils.sheet_to_json(sheet4, { header: 1 });
    let dataRows = rows.slice(1);
    if (dataRows.length > 0 && String(dataRows[0][0]).includes('配方编号')) {
      dataRows = dataRows.slice(1);
    }
    await prisma.healthFormula.deleteMany({});
    for (const row of dataRows) {
      if (!row || !row[1]) continue;
      await prisma.healthFormula.create({
        data: {
          code: String(row[0] || ''),
          name: String(row[1] || ''),
          positioning: String(row[2] || ''),
          targetCrowd: String(row[3] || ''),
          coreMaterials: String(row[4] || ''),
          dosagePerUnit: String(row[5] || ''),
          dailyIntake: String(row[6] || ''),
          activeTarget: String(row[7] || ''),
          dosageForm: String(row[8] || ''),
          materialSource: String(row[9] || ''),
          extractionRatio: String(row[10] || ''),
          qualityStandard: String(row[11] || ''),
          theoreticalBasis: String(row[12] || ''),
          sensoryEvaluation: String(row[13] || ''),
          stability: String(row[14] || ''),
          shelfLifePred: String(row[15] || ''),
          competitors: String(row[16] || ''),
          riskWarning: String(row[17] || ''),
          validationStatus: String(row[18] || ''),
        },
      });
    }
    console.log('✅ 产品配方库 导入完成');
  }

  // 5. 竞品数据库 (Sheet 5)
  const sheet5 = wb.Sheets['5-竞品数据库'];
  if (sheet5) {
    const rows: any[] = XLSX.utils.sheet_to_json(sheet5, { header: 1 });
    let dataRows = rows.slice(1);
    if (dataRows.length > 0 && String(dataRows[0][0]).includes('序号')) {
      dataRows = dataRows.slice(1);
    }
    await prisma.healthCompetitor.deleteMany({});
    for (const row of dataRows) {
      if (!row || !row[1]) continue;
      await prisma.healthCompetitor.create({
        data: {
          name: String(row[1] || ''),
          company: String(row[2] || ''),
          brand: String(row[3] || ''),
          functionPos: String(row[4] || ''),
          mainIngredients: String(row[5] || ''),
          dosageForm: String(row[6] || ''),
          launchTime: String(row[7] || ''),
          price: String(row[8] || ''),
          priceRange: String(row[9] || ''),
          channels: String(row[10] || ''),
          monthlySales: String(row[12] || ''),
          annualSales: String(row[13] || ''),
          socialHeat: `淘宝: ${row[14] || '-'} | 京东: ${row[15] || '-'} | 抖音: ${row[16] || '-'} | 小红书: ${row[17] || '-'}`,
          userReviews: String(row[19] || ''),
          opportunity: String(row[20] || ''),
        },
      });
    }
    console.log('✅ 竞品数据库 导入完成');
  }

  // 6. 文献证据库 (Sheet 6)
  const sheet6 = wb.Sheets['6-文献证据库'];
  if (sheet6) {
    const rows: any[] = XLSX.utils.sheet_to_json(sheet6, { header: 1 });
    let dataRows = rows.slice(1);
    if (dataRows.length > 0 && String(dataRows[0][0]).includes('文献编号')) {
      dataRows = dataRows.slice(1);
    }
    await prisma.healthLiterature.deleteMany({});
    for (const row of dataRows) {
      if (!row || !row[1]) continue;
      await prisma.healthLiterature.create({
        data: {
          code: String(row[0] || ''),
          title: String(row[1] || ''),
          authors: String(row[2] || ''),
          journal: String(row[3] || ''),
          year: parseInt(String(row[4] || '0')) || null,
          material: String(row[5] || ''),
          researchDir: String(row[6] || ''),
          model: String(row[7] || ''),
          expType: String(row[8] || ''),
          sampleSize: String(row[9] || ''),
          dosage: String(row[10] || ''),
          expPeriod: String(row[11] || ''),
          evidenceLevel: String(row[12] || ''),
          conclusionCred: String(row[13] || ''),
          keyConclusion: String(row[14] || ''),
          aiSummary: String(row[15] || ''),
          doi: String(row[16] || ''),
        },
      });
    }
    console.log('✅ 文献证据库 导入完成');
  }

  // 7. 专利数据库 (Sheet 7)
  const sheet7 = wb.Sheets['7-专利数据库'];
  if (sheet7) {
    const rows: any[] = XLSX.utils.sheet_to_json(sheet7, { header: 1 });
    let dataRows = rows.slice(1);
    if (dataRows.length > 0 && String(dataRows[0][0]).includes('专利号')) {
      dataRows = dataRows.slice(1);
    }
    await prisma.healthPatent.deleteMany({});
    for (const row of dataRows) {
      if (!row || !row[0]) continue;
      await prisma.healthPatent.create({
        data: {
          patentNo: String(row[0] || ''),
          title: String(row[1] || ''),
          applicant: String(row[2] || ''),
          applyDate: String(row[3] || ''),
          materials: String(row[4] || ''),
          techDirection: String(row[5] || ''),
          abstract: String(row[6] || ''),
          patentStatus: String(row[7] || ''),
          legalStatus: String(row[8] || ''),
          familyPatents: String(row[9] || ''),
          competitors: String(row[10] || ''),
          verification: String(row[12] || ''),
          url: String(row[14] || row[13] || ''),
        },
      });
    }
    console.log('✅ 专利数据库 导入完成');
  }

  // 8. 原料质量标准库 (Sheet 9)
  const sheet9 = wb.Sheets['9-原料质量标准库'];
  if (sheet9) {
    const rows: any[] = XLSX.utils.sheet_to_json(sheet9, { header: 1 });
    let dataRows = rows.slice(1);
    if (dataRows.length > 0 && String(dataRows[0][0]).includes('序号')) {
      dataRows = dataRows.slice(1);
    }
    await prisma.healthQualityStandard.deleteMany({});
    for (const row of dataRows) {
      if (!row || !row[1]) continue;
      await prisma.healthQualityStandard.create({
        data: {
          materialName: String(row[1] || ''),
          testItem: String(row[2] || ''),
          standardLimit: String(row[3] || ''),
          testMethod: String(row[4] || ''),
          standardSource: String(row[5] || ''),
          qualityGrade: String(row[6] || ''),
          remark: String(row[7] || ''),
        },
      });
    }
    console.log('✅ 原料质量标准库 导入完成');
  }

  // 9. 工艺技术数据库 (Sheet 10)
  const sheet10 = wb.Sheets['10-工艺技术数据库'];
  if (sheet10) {
    const rows: any[] = XLSX.utils.sheet_to_json(sheet10, { header: 1 });
    let dataRows = rows.slice(1);
    if (dataRows.length > 0 && String(dataRows[0][0]).includes('序号')) {
      dataRows = dataRows.slice(1);
    }
    await prisma.healthProcess.deleteMany({});
    for (const row of dataRows) {
      if (!row || !row[1]) continue;
      await prisma.healthProcess.create({
        data: {
          materialName: String(row[1] || ''),
          targetComponent: String(row[2] || ''),
          solvent: String(row[3] || ''),
          temperature: String(row[4] || ''),
          duration: String(row[5] || ''),
          concentration: String(row[6] || ''),
          keyParams: String(row[7] || ''),
          qualityIndex: String(row[8] || ''),
          yieldRate: String(row[9] || ''),
          labScale: String(row[10] || ''),
          pilotScale: String(row[11] || ''),
          scaleUpRisk: String(row[12] || ''),
          criticalControl: String(row[13] || ''),
        },
      });
    }
    console.log('✅ 工艺技术数据库 导入完成');
  }

  // 10. 供应链数据库 (Sheet 11)
  const sheet11 = wb.Sheets['11-供应链数据库'];
  if (sheet11) {
    const rows: any[] = XLSX.utils.sheet_to_json(sheet11, { header: 1 });
    let dataRows = rows.slice(1);
    if (dataRows.length > 0 && String(dataRows[0][0]).includes('序号')) {
      dataRows = dataRows.slice(1);
    }
    await prisma.healthSupplier.deleteMany({});
    for (const row of dataRows) {
      if (!row || !row[1]) continue;
      await prisma.healthSupplier.create({
        data: {
          materialName: String(row[1] || ''),
          supplierName: String(row[2] || ''),
          origin: String(row[3] || ''),
          annualCapacity: String(row[4] || ''),
          gmpCertified: String(row[5] || ''),
          testingCapacity: String(row[6] || ''),
          qualitySystem: String(row[7] || ''),
          auditStatus: String(row[8] || ''),
          auditDate: String(row[9] || ''),
          coaCapacity: String(row[10] || ''),
          price: String(row[11] || ''),
          supplyStability: String(row[12] || ''),
          stabilityPeriod: String(row[13] || ''),
          altSupplier: String(row[14] || ''),
          coopStatus: String(row[15] || ''),
          remark: String(row[16] || ''),
        },
      });
    }
    console.log('✅ 供应链数据库 导入完成');
  }

  // 11. AI知识标签库 (Sheet 12)
  const sheet12 = wb.Sheets['12-AI知识标签库'];
  if (sheet12) {
    const rows: any[] = XLSX.utils.sheet_to_json(sheet12, { header: 1 });
    let dataRows = rows.slice(1);
    if (dataRows.length > 0 && String(dataRows[0][0]).includes('标签编号')) {
      dataRows = dataRows.slice(1);
    }
    await prisma.healthAiTag.deleteMany({});
    for (const row of dataRows) {
      if (!row || !row[2]) continue;
      await prisma.healthAiTag.create({
        data: {
          code: String(row[0] || ''),
          category: String(row[1] || ''),
          name: String(row[2] || ''),
          description: String(row[3] || ''),
          relatedSheet: String(row[4] || ''),
          relatedField: String(row[5] || ''),
          aiUsage: String(row[6] || ''),
          weight: String(row[7] || ''),
        },
      });
    }
    console.log('✅ AI知识标签库 导入完成');
  }

  // 12. 产品生命周期 (Sheet 13)
  const sheet13 = wb.Sheets['13-产品生命周期'];
  if (sheet13) {
    const rows: any[] = XLSX.utils.sheet_to_json(sheet13, { header: 1 });
    let dataRows = rows.slice(1);
    if (dataRows.length > 0 && String(dataRows[0][0]).includes('产品编号')) {
      dataRows = dataRows.slice(1);
    }
    await prisma.healthProductLifecycle.deleteMany({});
    for (const row of dataRows) {
      if (!row || !row[1]) continue;
      await prisma.healthProductLifecycle.create({
        data: {
          code: String(row[0] || ''),
          name: String(row[1] || ''),
          stage: String(row[2] || ''),
          initiationTime: String(row[3] || ''),
          launchExpected: String(row[4] || ''),
          targetMarket: String(row[5] || ''),
          sellingPoint: String(row[6] || ''),
          targetRevenue: String(row[7] || ''),
          currentStatus: String(row[8] || ''),
          nextPlan: String(row[9] || ''),
          riskPoints: String(row[10] || ''),
          owner: String(row[11] || ''),
        },
      });
    }
    console.log('✅ 产品生命周期 导入完成');
  }

  // 13. 作用靶点数据库 (Sheet 14)
  const sheet14 = wb.Sheets['14-作用靶点数据库'];
  if (sheet14) {
    const rows: any[] = XLSX.utils.sheet_to_json(sheet14, { header: 1 });
    let dataRows = rows.slice(1);
    if (dataRows.length > 0 && String(dataRows[0][0]).includes('序号')) {
      dataRows = dataRows.slice(1);
    }
    await prisma.healthTarget.deleteMany({});
    for (const row of dataRows) {
      if (!row || !row[1]) continue;
      await prisma.healthTarget.create({
        data: {
          activeIngredient: String(row[1] || ''),
          targetName: String(row[2] || ''),
          signalPathway: String(row[3] || ''),
          diseaseDomain: String(row[4] || ''),
          actionType: String(row[5] || ''),
          evidenceLevel: String(row[6] || ''),
          keyLiterature: String(row[7] || ''),
        },
      });
    }
    console.log('✅ 作用靶点数据库 导入完成');
  }

  // 14. 法规知识库 (Sheet 15)
  const sheet15 = wb.Sheets['15-法规知识库'];
  if (sheet15) {
    const rows: any[] = XLSX.utils.sheet_to_json(sheet15, { header: 1 });
    let dataRows = rows.slice(1);
    if (dataRows.length > 0 && String(dataRows[0][0]).includes('序号')) {
      dataRows = dataRows.slice(1);
    }
    await prisma.healthRegulation.deleteMany({});
    for (const row of dataRows) {
      if (!row || !row[1]) continue;
      await prisma.healthRegulation.create({
        data: {
          name: String(row[1] || ''),
          publisher: String(row[2] || ''),
          publishDate: String(row[3] || ''),
          codeNo: String(row[4] || ''),
          scope: String(row[5] || ''),
          materials: String(row[6] || ''),
          restrictions: String(row[7] || ''),
          status: String(row[8] || ''),
          url: String(row[9] || ''),
        },
      });
    }
    console.log('✅ 法规知识库 导入完成');
  }

  // 15. 检测方法数据库 (Sheet 16)
  const sheet16 = wb.Sheets['16-检测方法数据库'];
  if (sheet16) {
    const rows: any[] = XLSX.utils.sheet_to_json(sheet16, { header: 1 });
    let dataRows = rows.slice(1);
    if (dataRows.length > 0 && String(dataRows[0][0]).includes('序号')) {
      dataRows = dataRows.slice(1);
    }
    await prisma.healthTestMethod.deleteMany({});
    for (const row of dataRows) {
      if (!row || !row[1]) continue;
      await prisma.healthTestMethod.create({
        data: {
          materialName: String(row[1] || ''),
          testItem: String(row[2] || ''),
          testMethod: String(row[3] || ''),
          methodStandard: String(row[4] || ''),
          limitRequirement: String(row[5] || ''),
          equipment: String(row[6] || ''),
          source: String(row[7] || ''),
          duration: String(row[8] || ''),
        },
      });
    }
    console.log('✅ 检测方法数据库 导入完成');
  }

  console.log('🎉 大健康研发知识平台 (药食同源) 所有数据导入成功！');
}

seedHealthData()
  .catch((e) => {
    console.error('❌ 导入数据失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
