export function prefixKeysWithCrc9f<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    result[`crc9f_${key}`] = value;
  }

  return result;
}
