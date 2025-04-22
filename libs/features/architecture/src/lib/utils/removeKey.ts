export const removeKey = (target: Record<string, any>, path: string) =>
  Object.keys(target).reduce((acc, key) => {
    if (key !== path) {
      return Object.assign({}, acc, { [key]: target[key] });
    }

    return acc;
  }, {});
