import { FILE_STATES } from '@rpldy/uploady';
import { useMemo } from 'react';
import styled from 'styled-components';
import useFileItem from './hooks/useFileItem';

interface FilePondListItemStatusProps {
  id: string;
}
export const FilePondListItemStatus = (props: FilePondListItemStatusProps) => {
  const { id } = props;
  const { file, completed, state } = useFileItem(id);

  const content = useMemo(() => {
    switch (state) {
      case FILE_STATES.FINISHED:
        return <div className="text-[0.75em]">上传完成</div>;
      case FILE_STATES.ABORTED:
      case FILE_STATES.CANCELLED:
      case FILE_STATES.ERROR:
        return <div className="text-[0.75em]">{file?.error}</div>;
      case FILE_STATES.UPLOADING:
        return (
          <div className="text-[0.75em]">上传中 {completed.toFixed(0)}%</div>
        );

      default:
        return null;
    }
  }, [completed, file?.error, state]);

  return <Container>{content}</Container>;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-grow: 0;
  flex-shrink: 0;
  margin: 0;
  min-width: 2.25em;
  text-align: right;
  will-change: transform, opacity;
  pointer-events: none;
  user-select: none;
  height: 100%;
`;

export default FilePondListItemStatus;
