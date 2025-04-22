import { ReactNode } from 'react';
import { ListContextProvider } from '../../context/ListContext';
import { ResourceContextProvider } from '../../context/ResourceContext';
import { ListControllerProps, useListController } from '../../controller/list';
import { RaRecord } from '../../types';

export const ListBase = <RecordType extends RaRecord = any>({
  children,
  ...props
}: ListControllerProps<RecordType> & { children: ReactNode }) => (
  <ResourceContextProvider value={props.resource as string}>
    <ListContextProvider value={useListController<RecordType>(props)}>
      {children}
    </ListContextProvider>
  </ResourceContextProvider>
);
