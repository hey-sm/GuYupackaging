import { includes } from 'lodash-es';
import moment from 'moment';

/** 按条件匹配 */
export const assert = (v1: any, v2: any, logic?: string) => {
  if (!logic) return false;
  if (logic === '=') return v1 === v2;
  if (logic === '!=') return v1 !== v2;
  if (logic === '>') return v1 > v2;
  if (logic === '>=') return v1 >= v2;
  if (logic === '<') return v1 < v2;
  if (logic === '<=') return v1 <= v2;
  if (logic === 'contain') return includes(v1, v2);
  if (logic === 'notcontain') return !includes(v1, v2);
  return false;
};

/** 获取查询条件范围值 */
export const getDateRange = (value: number, type: any) => {
  const data = moment().subtract(value, type);
  return [data.startOf(type), moment().endOf(type)];
};

export const imgType = (result:string) => {
  const reulstMore = result.split('.')
  const suffix = reulstMore[reulstMore.length - 1]
  return ['pdf','word','doc','docx'].includes(suffix)
}

export const isEqual = (first: any, seconde: any) => {
  const firstData = Object.keys(first)
  const secondeData = Object.keys(seconde)
  if (firstData.length !== secondeData.length) return false
  for (const k in first) {
    if (typeof first[k] === 'object' || typeof seconde[k] === 'object') {
      if (!isEqual(first[k], seconde[k])) return false
    } else if (first[k] !== seconde[k]) return false
  }
  return true
}


export const dateFormat = (date:any,flag?:boolean) => {
  const dt = new Date(date)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1).toString().padStart(2,'0')
  const d = dt.getDate().toString().padStart(2,'0')

  const hh = dt.getHours().toString().padStart(2,'0')
  const mm = dt.getMinutes().toString().padStart(2,'0')
  const ss = dt.getSeconds().toString().padStart(2,'0')
  if (flag) return `${y}-${m}-${d}`
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

export * from './EntityFieldsFactory';
export * from './excel';
// export * from './currency';
