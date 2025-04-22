import { createContext, ReactNode, useContext } from 'react';
import { RaRecord } from '../../types';

export const RecordContext = createContext<
  RaRecord | Omit<RaRecord, 'id'> | undefined
>(undefined);

export const RecordContextProvider = <
  RecordType extends RaRecord | Omit<RaRecord, 'id'> = RaRecord
>({
  children,
  value,
}: RecordContextProviderProps<RecordType>) => (
  <RecordContext.Provider value={value as any}>
    {children}
  </RecordContext.Provider>
);

export interface RecordContextProviderProps<RecordType> {
  children: ReactNode;
  value?: RecordType;
}

export const useRecordContext = <
  RecordType extends RaRecord | Omit<RaRecord, 'id'> = RaRecord
>(
  props?: UseRecordContextParams<RecordType>
): RecordType | undefined => {
  const context = useContext(RecordContext) as RecordType;

  return (props && props.record) || context;
};

export interface UseRecordContextParams<
  RecordType extends RaRecord | Omit<RaRecord, 'id'> = RaRecord
> {
  record?: RecordType;
  [key: string]: any;
}
