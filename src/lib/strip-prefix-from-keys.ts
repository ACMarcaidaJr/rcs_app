// export function stripPrefixFromKeys<T extends Record<string, any>>(
//   dataArray: T[],
//   prefix: string = 'crc9f_'
// ): T[] {
//   return dataArray.map((item) => {
//     const newItem: Record<string, any> = {};

//     for (const key in item) {
//       if (Object.prototype.hasOwnProperty.call(item, key)) {
//         const newKey = key.startsWith(prefix) ? key.slice(prefix.length) : key;
//         newItem[newKey] = item[key];
//       }
//     }

//     return newItem as T;
//   });
// }

export function stripPrefixFromKeys<T = any>(
  data: T,
  prefix: string = "crc9f_"
): T {
  if (Array.isArray(data)) {
    return data.map((item) => stripPrefixFromKeys(item, prefix)) as T;
  }

  if (data !== null && typeof data === "object") {
    const newObj: Record<string, any> = {};

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const newKey = key.startsWith(prefix)
          ? key.slice(prefix.length)
          : key;

        newObj[newKey] = stripPrefixFromKeys(data[key], prefix);
      }
    }

    return newObj as T;
  }

  return data;
}