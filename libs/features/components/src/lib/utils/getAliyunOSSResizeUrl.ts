export interface AliyunOSSResizeOptions {
  /**
   * 指定缩放的模式。
   * lfit（默认值）：等比缩放，缩放图限制为指定w与h的矩形内的最大图片。
   * mfit：等比缩放，缩放图为延伸出指定w与h的矩形框外的最小图片。
   * fill：将原图等比缩放为延伸出指定w与h的矩形框外的最小图片，然后将超出的部分进行居中裁剪。
   * pad：将原图缩放为指定w与h的矩形内的最大图片，然后使用指定颜色居中填充空白部分。
   * fixed：固定宽高，强制缩放。
   */
  m?: 'lfit' | 'mfit' | 'fill' | 'pad' | 'fixed';
  /**
   * 指定目标缩放图的宽度。
   */
  w?: number; // [1,16384]
  /**
   * 指定目标缩放图的高度。
   */
  h?: number; // [1,16384]
  /**
   * 指定目标缩放图的最长边。
   */
  l?: number;
  /**
   * 指定目标缩放图的最短边。
   */
  s?: number;
  /**
   * 当目标图片分辨率大于原图分辨率时，是否进行缩放。默认 1
   */
  limit?: 1 | 0;
  /**
   * 当缩放模式选择为pad（缩放填充）时，可以设置填充的颜色。
   */
  color?: string;
}

const defaultOptions: AliyunOSSResizeOptions = {
  m: 'lfit',
};

export const getAliyunOSSResizeUrl = (
  url: string,
  options?: AliyunOSSResizeOptions
) => {
  const query = Object.assign(defaultOptions, options ?? {});
  const params = Object.entries(query).map(([key, value]) => `${key}_${value}`);

  return `${url}?x-oss-process=${['image/resize', ...params].join(',')}`;
};
