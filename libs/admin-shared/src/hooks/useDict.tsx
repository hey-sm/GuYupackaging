import { UseQueryOptions } from '@tanstack/react-query';
import { selectByCodeDic, useSelectByCodeDic } from '../endpoints';

export const useDict = (
  code: string,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof selectByCodeDic>>>;
  }
) => {
  const { data, isLoading } = useSelectByCodeDic({ code }, options);

  const items = data?.data ?? [];
  return {
    isLoading,
    originalData: items,
    options: items.map((v:any) => ({ label: v.dictName, value: v.dictKey })),
  };
};
