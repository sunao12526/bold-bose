import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; remark?: string; values?: string[] }) {
    const { values, ...rest } = data;
    return this.prisma.mallProperty.create({
      data: {
        ...rest,
        values:
          values && values.length > 0
            ? {
                create: values.map((v) => ({ value: v })),
              }
            : undefined,
      },
      include: { values: true },
    });
  }

  async findAll() {
    return this.prisma.mallProperty.findMany({
      include: { values: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const property = await this.prisma.mallProperty.findUnique({
      where: { id },
      include: { values: true },
    });
    if (!property) throw new NotFoundException('商品规格不存在');
    return property;
  }

  async update(
    id: number,
    data: {
      name?: string;
      remark?: string;
      values?: { id?: number; value: string }[];
    },
  ) {
    await this.findOne(id);
    const { values, ...rest } = data;

    await this.prisma.mallProperty.update({
      where: { id },
      data: rest,
    });

    if (values !== undefined) {
      // Sync property values
      const keepIds = values
        .map((v) => v.id)
        .filter((vid): vid is number => !!vid);

      // 1. Delete removed values
      await this.prisma.mallPropertyValue.deleteMany({
        where: {
          propertyId: id,
          id: { notIn: keepIds },
        },
      });

      // 2. Insert or update values
      for (const val of values) {
        if (val.id) {
          await this.prisma.mallPropertyValue.update({
            where: { id: val.id },
            data: { value: val.value },
          });
        } else {
          await this.prisma.mallPropertyValue.create({
            data: {
              propertyId: id,
              value: val.value,
            },
          });
        }
      }
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    // Values will be deleted automatically due to Prisma schema Cascade relation onDelete
    return this.prisma.mallProperty.delete({
      where: { id },
    });
  }
}
