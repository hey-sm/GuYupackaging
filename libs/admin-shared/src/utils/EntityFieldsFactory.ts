import { IFields } from '../typings/fields';

export class EntityFieldsFactory {
  static entityFieldsMap: Map<string, IFields> = new Map();

  static registerFields(key: string, fields: IFields) {
    this.entityFieldsMap.set(key, fields);
  }

  static getEntityFields(key: string): IFields {
    const map = this.entityFieldsMap.get(key);
    if (!map) {
      console.error('Module Fields not defined', key);
      return {} as any;
    }
    return map;
  }
}
