import {
  BatchItem,
  FILE_STATES,
  useItemAbortListener,
  useItemCancelListener,
  useItemFinalizeListener,
  useItemProgressListener,
} from '@rpldy/uploady';

import { useMemo, useState } from 'react';
import { useFilePond } from '../context/FilePondContext';
import { FileItem } from '../types';

export default function useFileItem(id: string) {
  const { files, setFiles } = useFilePond();

  const file = useMemo(
    () => files?.find((v) => v.id === id) as FileItem,
    [files, id]
  );
  const [state, setState] = useState<FILE_STATES>(
    file?.state ?? FILE_STATES.PENDING
  );

  const { completed } = useItemProgressListener(id) || { completed: 0 };

  const setFileItem = (item: BatchItem) => {
    setState(item.state);
    setFiles((draft) => {
      const file = draft.find((v) => v.id === id);

      if (file) {
        Object.assign(file, item);
      }
    });
  };

  useItemAbortListener(setFileItem, id);
  useItemCancelListener(setFileItem, id);
  useItemProgressListener(setFileItem, id);
  useItemFinalizeListener(setFileItem, id);

  return {
    file,
    completed,
    state,
  };
}
