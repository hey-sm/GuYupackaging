import currency from 'currency.js';

export const CNY = (amount: string | number) =>
  currency(Number(amount), { symbol: '¥ ' });

export const SUBTRACT = (productNum: string | number, cur: string | number) =>
currency(Number(productNum)).subtract(cur)

/**
* 减法运算，避免数据相减小数点后产生多位数和计算精度损失。
*
* @param num1被减数  |  num2减数
*/
export function numSub(num1:any, num2:any) {
  let baseNum1, baseNum2;
  try {
      baseNum1 = num1.toString().split(".")[1].length;
  } catch (e) {
      baseNum1 = 0;
  }
  try {
      baseNum2 = num2.toString().split(".")[1].length;
  } catch (e) {
      baseNum2 = 0;
  }
  const baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
  const precision = (baseNum1 >= baseNum2) ? baseNum1 : 4;
  return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
};

