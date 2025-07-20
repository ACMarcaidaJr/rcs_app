export function stripPrefixFromKeys<T extends Record<string, any>>(
  dataArray: T[],
  prefix: string = 'crc9f_'
): T[] {
  return dataArray.map((item) => {
    const newItem: Record<string, any> = {};

    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const newKey = key.startsWith(prefix) ? key.slice(prefix.length) : key;
        newItem[newKey] = item[key];
      }
    }

    return newItem as T;
  });
}
