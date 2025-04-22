/* eslint-disable @typescript-eslint/ban-types */

import { QueryFunctionContext, QueryKey } from '@tanstack/react-query';

export interface RaRecord {
  id?: string;
  [key: string]: any;
}

export interface PaginationPayload {
  page: number;
  perPage: number;
}

export interface SortPayload {
  field: string;
  order: string;
}

export interface GetListParams {
  pagination: PaginationPayload;
  sort: SortPayload;
  filter: any;
  meta?: any;
}

export interface GetListResult<RecordType extends RaRecord = any> {
  data: RecordType[];
  total?: number;
  pageInfo?: {
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}

export type DataProvider = {
  getList: <RecordType extends RaRecord = any>(
    params: GetListParams
  ) => Promise<GetListResult<RecordType>>;

  getOne: <RecordType extends RaRecord = any>(
    params: GetOneParams
  ) => Promise<GetOneResult<RecordType>>;

  getMany: <RecordType extends RaRecord = any>(
    params: GetManyParams
  ) => Promise<GetManyResult<RecordType>>;

  update: <RecordType extends RaRecord = any>(
    params: UpdateParams
  ) => Promise<UpdateResult<RecordType>>;

  updateMany: (params: UpdateManyParams) => Promise<UpdateManyResult>;

  create: <RecordType extends RaRecord = any>(
    params: CreateParams
  ) => Promise<CreateResult<RecordType>>;

  delete: <RecordType extends RaRecord = any>(
    params: DeleteParams<RecordType>
  ) => Promise<DeleteResult<RecordType>>;

  deleteMany: <RecordType extends RaRecord = any>(
    params: DeleteManyParams<RecordType>
  ) => Promise<DeleteManyResult<RecordType>>;

  [key: string]: any;
};

export interface GetOneParams {
  id: string;
  meta?: any;
}

export interface GetOneResult<RecordType extends RaRecord = any> {
  data: RecordType;
}

export interface GetManyParams {
  ids: string[];
  meta?: any;
}

export interface GetManyResult<RecordType extends RaRecord = any> {
  data: RecordType[];
}

export interface UpdateParams<T = any> {
  id: string;
  data: Partial<T>;
  previousData: T;
  meta?: any;
}
export interface UpdateResult<RecordType extends RaRecord = any> {
  data: RecordType;
}

export interface UpdateManyParams<T = any> {
  ids: string[];
  data: T;
  meta?: any;
}
export interface UpdateManyResult {
  data?: string[];
}

export interface CreateParams<T = any> {
  data: T;
  meta?: any;
}
export interface CreateResult<RecordType extends RaRecord = any> {
  data: RecordType;
}

export interface DeleteParams<RecordType extends RaRecord = any> {
  id: string;
  previousData?: RecordType;
  meta?: any;
}
export interface DeleteResult<RecordType extends RaRecord = any> {
  data: RecordType;
}

export interface DeleteManyParams<RecordType extends RaRecord = any> {
  ids: RecordType['id'][];
  meta?: any;
}
export interface DeleteManyResult<RecordType extends RaRecord = any> {
  data?: RecordType['id'][];
}

export type DataProviderResult<RecordType extends RaRecord = any> =
  | CreateResult<RecordType>
  | DeleteResult<RecordType>
  | DeleteManyResult
  | GetListResult<RecordType>
  | GetManyResult<RecordType>
  | GetOneResult<RecordType>
  | UpdateResult<RecordType>
  | UpdateManyResult;

export type Exporter = (
  data: any,
  fetchRelatedRecords: (
    data: any,
    field: string,
    resource: string
  ) => Promise<any>,
  dataProvider: DataProvider,
  resource?: string
) => void | Promise<void>;

export type Action = 'create' | 'edit' | 'list' | 'show' | 'clone';

export type FormAction = Extract<Action, 'create' | 'edit' | 'clone'>;

export type Snapshot = [key: QueryKey, value: any][];

export interface BulkActionProps {
  filterValues?: any;
  resource?: string;
  selectedIds?: string[];
}

//

export interface HttpError extends Record<string, any> {
  message: string;
  statusCode: number;
}

export type Fields = Array<string | object | NestedField>;

export type NestedField = {
  operation: string;
  variables: QueryBuilderOptions[];
  fields: Fields;
};

export type VariableOptions =
  | {
      type?: string;
      name?: string;
      value: any;
      list?: boolean;
      required?: boolean;
    }
  | { [k: string]: any };

export interface QueryBuilderOptions {
  operation?: string;
  fields?: Fields;
  variables?: VariableOptions;
}

export type MetaDataQuery = {
  [k: string]: any;
  queryContext?: Omit<QueryFunctionContext, 'meta'>;
} & QueryBuilderOptions;

export interface UpdatePasswordFormTypes {
  password?: string;
  confirmPassword?: string;
}

export interface FilterPayload {
  [k: string]: any;
}

export interface UserIdentity {
  id: string;
  fullName?: string;
  avatar?: string;
  [key: string]: any;
}

export interface Resource extends Partial<DataProvider> {
  name: string;
}
