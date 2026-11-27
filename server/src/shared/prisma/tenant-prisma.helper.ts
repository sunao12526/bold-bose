export const TENANT_MODELS = new Set<string>([
  'User',
  'Role',
  'Dept',
  'Post',
  'Notice',
  'NotifyTemplate',
  'NotifyMessage',
  'LoginLog',
  'OperationLog',
  'MemberUser',
  'MallOrder',
  'PayApp',
  'PayOrder',
]);

const WHERE_FILTER_OPS = new Set([
  'findMany',
  'findFirst',
  'findFirstOrThrow',
  'count',
  'aggregate',
  'groupBy',
  'updateMany',
  'deleteMany',
]);

const UNIQUE_OPS = new Set(['findUnique', 'findUniqueOrThrow']);

export function applyTenantToArgs(
  model: string | undefined,
  operation: string,
  args: any,
  tenantId: number | undefined,
  ignore = false,
): any {
  if (ignore || !tenantId || !model || !TENANT_MODELS.has(model)) {
    return args;
  }

  const nextArgs = args ? { ...args } : {};

  if (WHERE_FILTER_OPS.has(operation)) {
    const currentWhere = nextArgs.where ? { ...nextArgs.where } : {};
    if (currentWhere.tenantId === undefined) {
      currentWhere.tenantId = tenantId;
    }
    nextArgs.where = currentWhere;
    return nextArgs;
  }

  if (operation === 'create') {
    const currentData = nextArgs.data ? { ...nextArgs.data } : {};
    if (currentData.tenantId === undefined) {
      currentData.tenantId = tenantId;
    }
    nextArgs.data = currentData;
    return nextArgs;
  }

  if (operation === 'createMany' || operation === 'createManyAndReturn') {
    if (Array.isArray(nextArgs.data)) {
      nextArgs.data = nextArgs.data.map((item: any) => ({
        ...item,
        tenantId: item?.tenantId === undefined ? tenantId : item.tenantId,
      }));
    } else if (nextArgs.data && typeof nextArgs.data === 'object') {
      nextArgs.data = {
        ...nextArgs.data,
        tenantId:
          nextArgs.data.tenantId === undefined
            ? tenantId
            : nextArgs.data.tenantId,
      };
    }
    return nextArgs;
  }

  if (operation === 'upsert') {
    const currentCreate = nextArgs.create ? { ...nextArgs.create } : {};
    if (currentCreate.tenantId === undefined) {
      currentCreate.tenantId = tenantId;
    }
    nextArgs.create = currentCreate;
    return nextArgs;
  }

  return args;
}

export function verifyTenantResult(
  model: string | undefined,
  operation: string,
  result: any,
  tenantId: number | undefined,
  ignore = false,
): any {
  if (
    ignore ||
    !tenantId ||
    !model ||
    !TENANT_MODELS.has(model) ||
    !UNIQUE_OPS.has(operation) ||
    !result ||
    typeof result !== 'object'
  ) {
    return result;
  }

  if (result.tenantId !== undefined && result.tenantId !== tenantId) {
    if (operation === 'findUniqueOrThrow') {
      throw new Error(`${model} record not found in current tenant`);
    }
    return null;
  }

  return result;
}
