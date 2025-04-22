import {
  BatchItem,
  useBatchAddListener,
  useRequestPreSend,
} from '@rpldy/uploady';
import { first } from 'lodash-es';
import { nanoid } from 'nanoid';
import { extname } from '../utils';
import FilePondList from './FilePondList';
import { useFilePond } from './context/FilePondContext';

export const FilePondPanel = () => {
  const { setFiles } = useFilePond();

  useBatchAddListener((batch) => {
    const items = batch.items.map((v) => ({
      ...v,
      name: v.file.name,
    }));

    setFiles((draft) => {
      draft.push(...items);
    });
  });

  useRequestPreSend(({ items, options }) => {
    const batchItem: BatchItem | undefined = first(items);

    const params = {
      name: batchItem?.file?.name,
      key: [
        options.destination?.params?.key,
        nanoid() + '.' + extname(batchItem?.file.name),
      ]
        .filter(Boolean)
        .join(''),
    };

    return {
      options: {
        destination: {
          params,
        },
      },
    };
  });

  return (
    <div className="file-pond-list">
      <FilePondList />
    </div>
  );
};

export default FilePondPanel;
