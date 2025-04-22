/** 数组转换为树形解构 */
export function arrayToTree<T extends { id?: string; parentId?: string }>(
  list: T[],
  parentId = ''
): T[] {
  return list
    .filter((item) => item.parentId === parentId)
    .map<T>((item) => ({
      ...item,
      children: arrayToTree(list, item.id),
    }));
}

/** 树形解构转换为数组 */
export function treeToArray<T extends { children?: T[] }>(
  list: T[],
  newArr: T[] = []
) {
  list.forEach((item) => {
    const { children } = item;
    if (children && children.length) {
      treeToArray(children, newArr);
    }
    newArr.push(item);
  });
  return newArr;
}

/** 更新树 */
// export function updateTree<T extends { children?: T[] }>(tree: T[], where: (item: T) => boolean, update: (item: T) => void, children = (item: T) => item.children) {
//   return tree.map((item) => {
//     if (where(item)) {
//       return update(item)
//     } else {
//       if (children(item)) {
//         return {
//           ...item,
//           children: updateTree(children(item), where, update),
//         }
//       } else {
//         return { ...item }
//       }
//     }
//   })
// }

export function joinFeedbackNecessary<T>(
  collection: T[] | string | undefined | null,
  callback: (v: T) => any,
  feedback: (v: any) => any,
  separator?: string | undefined
) {
  return Array.isArray(collection)
    ? collection.map(callback).join(separator ?? '、')
    : feedback?.(collection);
}
