"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateQuery = paginateQuery;
async function paginateQuery(prisma, model, query, options) {
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 20));
    const skip = (page - 1) * pageSize;
    const where = options?.where || {};
    const orderBy = options?.orderBy || { id: 'desc' };
    const prismaModel = prisma[model];
    if (!prismaModel) {
        throw new Error(`Model "${model}" not found`);
    }
    const [items, total] = await Promise.all([
        prismaModel.findMany({
            where,
            orderBy,
            skip,
            take: pageSize,
            ...(options?.include ? { include: options.include } : {}),
            ...(options?.select ? { select: options.select } : {}),
        }),
        prismaModel.count({ where }),
    ]);
    return { items, total };
}
//# sourceMappingURL=pagination.js.map