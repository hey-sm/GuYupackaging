export const trimObjectStringValue = (data: { [key: string]: any }) => {
  return Object.keys(data).reduce((acc, cur) => {
    if (typeof data[cur] === 'string') {
      acc[cur] = data[cur].trim();
    } else {
      acc[cur] = data[cur];
    }
    return acc;
  }, {});
};
