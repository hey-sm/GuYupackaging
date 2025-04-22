import { createContext, useCallback, useContext, useMemo } from 'react';
import { FileItem } from '../types';
import { useFilePond } from './FilePondContext';

interface FileItemContextValue {
  item: FileItem;
  remove: () => void;
}

const FileItemContext = createContext<FileItemContextValue | undefined>(
  undefined
);

export const FileItemProvider = ({
  item,
  children,
}: {
  item: FileItem;
  children: React.ReactNode;
}) => {
  const { removeItem } = useFilePond();
  const remove = useCallback(() => removeItem(item), [item, removeItem]);
  const value = useMemo(() => ({ item, remove }), [item, remove]);
  return (
    <FileItemContext.Provider value={value}>
      {children}
    </FileItemContext.Provider>
  );
};

export const useFileItem = () => {
  const contextValue = useContext(FileItemContext);
  return contextValue || ({} as FileItemContextValue);
};
