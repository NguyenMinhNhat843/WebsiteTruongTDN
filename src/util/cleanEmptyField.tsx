/* eslint-disable @typescript-eslint/no-explicit-any */
export const cleanEmptyFields = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(cleanEmptyFields);
  if (typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const val = obj[key];
      // Nếu là chuỗi rỗng thì chuyển thành undefined
      if (typeof val === "string" && val.trim() === "") {
        acc[key] = undefined;
      } else if (typeof val === "object") {
        acc[key] = cleanEmptyFields(val);
      } else {
        acc[key] = val;
      }
      return acc;
    }, {} as any);
  }
  return obj;
};
