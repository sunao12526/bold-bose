import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { BpmDefinitionService } from './bpm-definition.service';
import {
  BpmCategoryQueryDto,
  BpmFormQueryDto,
  BpmModelQueryDto,
  CreateBpmCategoryDto,
  CreateBpmFormDto,
  CreateBpmModelDto,
  UpdateBpmCategoryDto,
  UpdateBpmFormDto,
  UpdateBpmModelDto,
} from './dto/bpm.dto';

@ApiTags('工作流 - 流程分类')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('bpm/category')
export class BpmCategoryController {
  constructor(private readonly service: BpmDefinitionService) {}

  @Get('simple-list')
  @ApiOperation({ summary: '获取启用的流程分类精简列表' })
  async simpleList() {
    return this.service.findSimpleCategories();
  }

  @Get()
  @RequirePermissions('bpm:category:query')
  @ApiOperation({ summary: '分页查询流程分类' })
  async findAll(@Query() query: BpmCategoryQueryDto) {
    return this.service.findAllCategories(query);
  }

  @Post()
  @RequirePermissions('bpm:category:create')
  @Log({ module: '流程分类', type: 'CREATE', description: '创建流程分类' })
  @ApiOperation({ summary: '创建流程分类' })
  async create(@Body() body: CreateBpmCategoryDto) {
    return this.service.createCategory(body);
  }

  @Put(':id')
  @RequirePermissions('bpm:category:update')
  @Log({ module: '流程分类', type: 'UPDATE', description: '更新流程分类' })
  @ApiOperation({ summary: '更新流程分类' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateBpmCategoryDto,
  ) {
    return this.service.updateCategory(id, body);
  }

  @Delete(':id')
  @RequirePermissions('bpm:category:delete')
  @Log({ module: '流程分类', type: 'DELETE', description: '删除流程分类' })
  @ApiOperation({ summary: '删除流程分类' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeCategory(id);
  }
}

@ApiTags('工作流 - 动态表单')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('bpm/form')
export class BpmFormController {
  constructor(private readonly service: BpmDefinitionService) {}

  @Get()
  @RequirePermissions('bpm:form:query')
  @ApiOperation({ summary: '分页查询工作流动态表单' })
  async findAll(@Query() query: BpmFormQueryDto) {
    return this.service.findAllForms(query);
  }

  @Get(':id')
  @RequirePermissions('bpm:form:query')
  @ApiOperation({ summary: '获取动态表单详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneForm(id);
  }

  @Post()
  @RequirePermissions('bpm:form:create')
  @Log({ module: '流程表单', type: 'CREATE', description: '创建流程表单' })
  @ApiOperation({ summary: '创建流程表单' })
  async create(@Body() body: CreateBpmFormDto) {
    return this.service.createForm(body);
  }

  @Put(':id')
  @RequirePermissions('bpm:form:update')
  @Log({ module: '流程表单', type: 'UPDATE', description: '更新流程表单' })
  @ApiOperation({ summary: '更新流程表单' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateBpmFormDto,
  ) {
    return this.service.updateForm(id, body);
  }

  @Delete(':id')
  @RequirePermissions('bpm:form:delete')
  @Log({ module: '流程表单', type: 'DELETE', description: '删除流程表单' })
  @ApiOperation({ summary: '删除流程表单' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeForm(id);
  }
}

@ApiTags('工作流 - 流程模型')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('bpm/model')
export class BpmModelController {
  constructor(private readonly service: BpmDefinitionService) {}

  @Get()
  @RequirePermissions('bpm:model:query')
  @ApiOperation({ summary: '分页查询流程模型' })
  async findAll(@Query() query: BpmModelQueryDto) {
    return this.service.findAllModels(query);
  }

  @Get(':id')
  @RequirePermissions('bpm:model:query')
  @ApiOperation({ summary: '获取流程模型详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneModel(id);
  }

  @Post()
  @RequirePermissions('bpm:model:create')
  @Log({ module: '流程模型', type: 'CREATE', description: '创建流程模型' })
  @ApiOperation({ summary: '创建流程模型' })
  async create(@Body() body: CreateBpmModelDto) {
    return this.service.createModel(body);
  }

  @Put(':id')
  @RequirePermissions('bpm:model:update')
  @Log({ module: '流程模型', type: 'UPDATE', description: '更新流程模型' })
  @ApiOperation({ summary: '更新流程模型' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateBpmModelDto,
  ) {
    return this.service.updateModel(id, body);
  }

  @Post(':id/deploy')
  @RequirePermissions('bpm:model:deploy')
  @Log({ module: '流程模型', type: 'UPDATE', description: '发布部署流程模型' })
  @ApiOperation({ summary: '发布部署流程模型' })
  async deploy(@Param('id', ParseIntPipe) id: number) {
    return this.service.deployModel(id);
  }

  @Delete(':id')
  @RequirePermissions('bpm:model:delete')
  @Log({ module: '流程模型', type: 'DELETE', description: '删除流程模型' })
  @ApiOperation({ summary: '删除流程模型' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeModel(id);
  }
}
