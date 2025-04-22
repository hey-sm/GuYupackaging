export type TypeList = Array<{ verifyName: string; name: string }>;

export const unknownTypes: TypeList = [
  { verifyName: 'image/jfif', name: 'image/jfif' },
  { verifyName: 'image/heic', name: 'image/heic' },
  { verifyName: 'video/mov', name: 'video/quicktime' },
];

export const matchUnknownTypes = (type: string): string => {
  const res = unknownTypes.filter(
    (unknownType) => unknownType.verifyName === type
  )[0];
  if (res) return res.name;
  return type;
};
