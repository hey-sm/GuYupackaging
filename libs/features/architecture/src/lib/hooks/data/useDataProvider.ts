import { keyBy } from 'lodash-es';
import {
  CreateParams,
  CreateResult,
  DeleteManyParams,
  DeleteManyResult,
  DeleteParams,
  DeleteResult,
  GetListParams,
  GetListResult,
  GetManyParams,
  GetManyResult,
  GetOneParams,
  GetOneResult,
  RaRecord,
  UpdateManyParams,
  UpdateManyResult,
  UpdateParams,
  UpdateResult,
} from '../../types';
import { useResources } from '../resource';

export type UseDataProviderReturnType<ResourceType extends string = string> = {
  getList: <RecordType extends RaRecord = any>(
    resource: ResourceType,
    params: GetListParams
  ) => Promise<GetListResult<RecordType>>;

  getOne: <RecordType extends RaRecord = any>(
    resource: ResourceType,
    params: GetOneParams
  ) => Promise<GetOneResult<RecordType>>;

  getMany: <RecordType extends RaRecord = any>(
    resource: ResourceType,
    params: GetManyParams
  ) => Promise<GetManyResult<RecordType>>;

  update: <RecordType extends RaRecord = any>(
    resource: ResourceType,
    params: UpdateParams
  ) => Promise<UpdateResult<RecordType>>;

  updateMany: (
    resource: ResourceType,
    params: UpdateManyParams
  ) => Promise<UpdateManyResult>;

  create: <RecordType extends RaRecord = any>(
    resource: ResourceType,
    params: CreateParams
  ) => Promise<CreateResult<RecordType>>;

  delete: <RecordType extends RaRecord = any>(
    resource: ResourceType,
    params: DeleteParams<RecordType>
  ) => Promise<DeleteResult<RecordType>>;

  deleteMany: <RecordType extends RaRecord = any>(
    resource: ResourceType,
    params: DeleteManyParams<RecordType>
  ) => Promise<DeleteManyResult<RecordType>>;

  [key: string]: any;
};

export const useDataProvider = (): UseDataProviderReturnType => {
  const resources = useResources();

  const resourceByName = keyBy(resources, (v) => v.name);

  // TODO 闭包 警告 没有定义 resource
  return {
    getList: (resource, params) => {
      return resourceByName[resource]?.getList?.(params) as any;
    },
    getOne: (resource, params) => {
      return resourceByName[resource]?.getOne?.(params) as any;
    },
    getMany(resource, params) {
      return resourceByName[resource]?.getMany?.(params) as any;
    },
    update(resource, params) {
      return resourceByName[resource]?.update?.(params) as any;
    },
    updateMany(resource, params) {
      return resourceByName[resource]?.updateMany?.(params) as any;
    },
    create(resource, params) {
      return resourceByName[resource]?.create?.(params) as any;
    },
    delete(resource, params) {
      return resourceByName[resource]?.delete?.(params) as any;
    },
    deleteMany(resource, params) {
      return resourceByName[resource]?.deleteMany?.(params) as any;
    },
  };
};
