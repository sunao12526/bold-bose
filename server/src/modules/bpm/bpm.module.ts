import { Module } from '@nestjs/common';
import {
  BpmCategoryController,
  BpmFormController,
  BpmModelController,
} from './bpm-definition.controller';
import { BpmDefinitionService } from './bpm-definition.service';
import { BpmEngineService } from './bpm-engine.service';
import {
  BpmOaLeaveController,
  BpmProcessInstanceController,
  BpmTaskController,
} from './bpm-runtime.controller';

@Module({
  controllers: [
    BpmCategoryController,
    BpmFormController,
    BpmModelController,
    BpmProcessInstanceController,
    BpmTaskController,
    BpmOaLeaveController,
  ],
  providers: [BpmDefinitionService, BpmEngineService],
  exports: [BpmDefinitionService, BpmEngineService],
})
export class BpmModule {}
