export const isFile = (value: any) =>
  !!(value instanceof File || (value instanceof Blob && value.name));
