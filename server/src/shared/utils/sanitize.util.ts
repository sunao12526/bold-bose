const SENSITIVE_KEYS = new Set([
  'password',
  'oldpassword',
  'newpassword',
  'secret',
  'clientsecret',
  'apisecret',
  'appsecret',
  'token',
  'accesstoken',
  'refreshtoken',
  'authorization',
]);

/**
 * 递归脱敏敏感字段，防止密码、密钥与令牌落入日志
 */
export function sanitizePayload(input: unknown, depth = 0): unknown {
  if (input === null || input === undefined) {
    return input;
  }
  if (depth > 8) {
    return '[MaxDepth]';
  }
  if (Array.isArray(input)) {
    return input.map((item) => sanitizePayload(item, depth + 1));
  }
  if (typeof input === 'object') {
    if (input instanceof Date) {
      return input.toISOString();
    }
    if (Buffer.isBuffer(input)) {
      return `[Buffer:${input.length}]`;
    }
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        result[key] = '***';
      } else {
        result[key] = sanitizePayload(value, depth + 1);
      }
    }
    return result;
  }
  return input;
}

/**
 * 脱敏后安全序列化为 JSON 字符串并限制最大长度
 */
export function safeJsonStringify(
  input: unknown,
  maxLength = 4000,
): string | null {
  if (input === undefined || input === null) {
    return null;
  }
  try {
    const sanitized = sanitizePayload(input);
    const text =
      typeof sanitized === 'string' ? sanitized : JSON.stringify(sanitized);
    if (!text) return null;
    return text.length > maxLength ? text.slice(0, maxLength) : text;
  } catch {
    return null;
  }
}
