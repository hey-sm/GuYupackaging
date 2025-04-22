import { useAbortItem, FILE_STATES } from '@rpldy/uploady';
import { Circle } from 'rc-progress';
import { useMemo } from 'react';
import RemoteItemButton from './RemoteItemButton';
import { useFilePond } from './context/FilePondContext';
import useFileItem from './hooks/useFileItem';

interface FilePondListItemActionProps {
  id: string;
}
export const FilePondListItemAction = (props: FilePondListItemActionProps) => {
  const { id } = props;

  const { removeItem } = useFilePond();
  const { file, completed, state } = useFileItem(id);

  const abortItem = useAbortItem();

  // TODO 可单独组件
  const processProgressIndicator = useMemo(() => {
    if (
      [
        FILE_STATES.PENDING,
        FILE_STATES.CANCELLED,
        FILE_STATES.FINISHED,
      ].includes(state)
    ) {
      return <RemoteItemButton />;
    }

    if (state === FILE_STATES.UPLOADING) {
      return (
        <button
          type="button"
          className="file-action-button"
          onClick={() => {
            if ([FILE_STATES.ABORTED, FILE_STATES.FINISHED].includes(state)) {
              return;
            }

            abortItem(id);
            removeItem(file);
          }}
        >
          <Circle percent={completed} strokeWidth={10} strokeColor="#fff" />
        </button>
      );
    }
    return null;
  }, [state, completed, abortItem, id, removeItem, file]);

  return processProgressIndicator;
};

export default FilePondListItemAction;
