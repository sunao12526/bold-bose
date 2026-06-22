"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSpuDto = exports.CreateSpuDto = exports.SkuDto = exports.SkuPropertyDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class SkuPropertyDto {
    propertyId;
    propertyName;
    valueId;
    valueName;
}
exports.SkuPropertyDto = SkuPropertyDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SkuPropertyDto.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SkuPropertyDto.prototype, "propertyName", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SkuPropertyDto.prototype, "valueId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SkuPropertyDto.prototype, "valueName", void 0);
class SkuDto {
    properties;
    price;
    marketPrice;
    costPrice;
    stock;
    picUrl;
    barCode;
}
exports.SkuDto = SkuDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SkuPropertyDto),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], SkuDto.prototype, "properties", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SkuDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SkuDto.prototype, "marketPrice", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SkuDto.prototype, "costPrice", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SkuDto.prototype, "stock", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SkuDto.prototype, "picUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SkuDto.prototype, "barCode", void 0);
class CreateSpuDto {
    name;
    categoryId;
    brandId;
    picUrl;
    sliderPicUrls;
    description;
    sort;
    status;
    skus;
}
exports.CreateSpuDto = CreateSpuDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '商品名称不能为空' }),
    __metadata("design:type", String)
], CreateSpuDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: '分类ID必须是整数' }),
    (0, class_validator_1.IsNotEmpty)({ message: '分类ID不能为空' }),
    __metadata("design:type", Number)
], CreateSpuDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: '品牌ID必须是整数' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateSpuDto.prototype, "brandId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '商品图片URL必须是字符串' }),
    (0, class_validator_1.IsNotEmpty)({ message: '商品主图不能为空' }),
    __metadata("design:type", String)
], CreateSpuDto.prototype, "picUrl", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: '轮播图URL必须是数组' }),
    (0, class_validator_1.IsString)({ each: true, message: '每个轮播图URL必须是字符串' }),
    (0, class_validator_1.IsNotEmpty)({ message: '轮播图不能为空' }),
    __metadata("design:type", Array)
], CreateSpuDto.prototype, "sliderPicUrls", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSpuDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateSpuDto.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.CommonStatus, { message: '状态值不合法' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSpuDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SkuDto),
    (0, class_validator_1.IsNotEmpty)({ message: 'SKU列表不能为空' }),
    __metadata("design:type", Array)
], CreateSpuDto.prototype, "skus", void 0);
class UpdateSpuDto extends CreateSpuDto {
}
exports.UpdateSpuDto = UpdateSpuDto;
//# sourceMappingURL=spu.dto.js.map