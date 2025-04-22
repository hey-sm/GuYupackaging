import { isEmpty, isObject } from 'lodash-es';

export const removeEmpty = (object: Record<string, any>) =>
  Object.keys(object).reduce((acc, key) => {
    let child = object[key];

    if (isObject(object[key])) {
      child = removeEmpty(object[key]);
    }

    return isEmpty(child) ? acc : { ...acc, [key]: child };
  }, {});
