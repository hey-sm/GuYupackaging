export interface MaterialVideoRelateResponse {
  operNameMod?: string;
  updateTime?: string;
  materialId?: string;
  operNameCreate?: string;
  coverUrl?: string;
  materialName?: string;
  operIdCreate?: string;
  videoUrl?: string;
  createTime?: string;
  operIdMod?: string;
  id?: string;
  businessType?: string;
  h5Address?: string;
}

export interface MaterialShareResponse {
  materialUrl?: string;
  videoRelateResponse?: MaterialVideoRelateResponse[];
  operNameMod?: string;
  updateTime?: string;
  materialId?: string;
  operNameCreate?: string;
  content?: string;
  coverUrl?: string;
  materialName?: string;
  operIdCreate?: string;
  createTime?: string;
  linkUrl?: string;
  operIdMod?: string;
  id?: string;
  h5Address?: string;
}
