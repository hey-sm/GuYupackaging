import currency from 'currency.js';
/**
 * 将“分”转换为“元”
 * @param price 单价，单位：分
 */
export const formatMoney = (price: number): string => {
  const money = yuan(price);
  return money.toFixed(2);
};

/**
 * 分转元,不允许在外部使用，所有对元的计算全部在这个工具类中操作
 * @param price 价格，单位：分
 */
const yuan = (price: number): number => {
  return price / 100;
};

export const CNY = (value: number | string) =>
  currency(value, { symbol: '￥' });
