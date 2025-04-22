export type Field = {
  /** 列名 */
  columnComment?: string;
  /** 列定义字段 */
  columnDefine: string;
};

export type highlightConfig = {
  /** 高亮匹配条件 */
  highlightCondition?: string;
  /** 高亮颜色 */
  highlightColor?: string;
  /** 是否支持行级：1：是 0：否 */
  highlightIsRow?: boolean;
  /** 高亮匹配值 */
  highlightValue?: any;
  /** 排序 */
  sort?: number;
};
export type FieldType =
  | 'month'
  | 'string'
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'options'
  | 'code'
  | 'radio'
  | 'upload'
  | 'upload-img'
  | 'areas'
  | 'company'
  | 'department'
  | 'user';
export type MainDetailField = Field & {
  /** 字段类型 */
  columnType: FieldType;
  /** 组件栅格 */
  formColumn?: number;
  /** 组件宽度：百分比 */
  compentWidth?: number;
  /** 默认值 */
  defaultValue?: any;
  /** 占位提示文本 */
  placeholder?: string;
  /** 是否禁用，禁用后不在页面展示，也不会提交这个字段的数据 */
  disabled?: boolean;
  /** 是否必填 */
  required?: boolean;

  /** 是否只读，其实是disabled */
  readOnly?: boolean;

  /** 是否显示组件清空按钮：number 组件不能用 */
  allowClear?: boolean;

  /** 文本最大长度：input、textarea 属性 */
  maxLength?: number;
  /** 文本正则校验列表：input、textarea 属性 */
  regexs?: Array<{ rule: string; message: string }>;

  /** 是否显示输入统计：textarea 属性 */
  showCount?: boolean;
  /** 最小行：textarea 属性 */
  minRows?: number;
  /** 最大行：textarea 属性 */
  maxRows?: number;

  /** 小数位数：input number 属性 */
  precisions?: number;
  /** 数字允许的最小值：number 属性 */
  minValue?: number;
  /** 数字允许的最大值：number 属性 */
  maxValue?: number;

  /** 数据字典：select 属性 */
  dataSource?: string;
  /** 是否多选：select 属性 */
  multiple?: boolean;
  /** 能否搜索：select 属性，单选模式有效 */
  showSearch?: boolean;

  /** 选择器类型：日期组件 */
  datePicker?: 'datetime' | 'date' | 'week' | 'month' | 'year';
  /** 日期格式：日期组件 （参考moment文档） */
  dateFormat?: string;

  /**上传文件类型：上传名称 */
  uploadName?: string;
  /**上传文件类型：上传文件大小 */
  fileMaxSize?: number;
  /**上传文件类型：按钮文字 */
  fileButtonName?: string;
  /**上传文件类型：宽度 */
  labelWidth?: number;

  /** 展示字段 */
  displayColumn?: string;

  /** 是否提交字段（编辑） */
  isCommit?: boolean;
  /** 是否隐藏（编辑） */
  isHide?: boolean;
  /** 是否显示（详情） */
  isDetailShow?: boolean;
};

export type MainListField = Field & {
  /** 居中对齐：center 左对齐：left 右对齐：right，这里返回英文 */
  alineType?: 'center' | 'left' | 'right';
  /** 列宽 */
  columnWidth?: number;
  /** true：高亮  false： 不高亮 */
  isHighlight?: boolean;
  /** true：行高亮 false： 不高亮 */
  highlightIsRow?: boolean;
  /** 高亮颜色条件配置 */
  highlightConfigs?: Array<highlightConfig>;
  /** true: 显示  false：不显示 */
  isShow?: boolean;
  /** true：需要合计  false： 不需要合计 */
  isSum?: boolean;
  /** 排序 */
  sort?: number;
};
export type EditField = MainListField & MainDetailField;
/** 主表查询配置 */
export type MainSearchField = Field & {
  /** 字段类型 */
  columnType: FieldType;
  /** 默认值 */
  defaultValue: string;
  /** 是否禁用 */
  disabled: boolean;
  /** 是否通用查询 */
  isCommon: boolean;
  /** 字典code */
  dataSource?: string;
  sort?: number;
  options?: Array<any>;
};
/** 功能配置 */
export interface IFields {
  columns?: Array<Field>;
  list?: Array<EditField>;
  searchs?: Array<MainSearchField>;
  details?: IDetails;
}

/** 页面模块配置 */
export interface IModuleConfig {
  moduleName?: string;
  layoutGrid?: number;
  moduleCode: string;
  columns: Array<EditField>;
}

/** 明细页面配置 */
export interface IDetails {
  main: IModuleConfig;
  children?: Array<IModuleConfig & { isForm: boolean }>;
}

/** 所有模块配置 */
export interface IModuleFields {
  [ke: string]: IFields;
}
