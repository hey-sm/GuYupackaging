import { FILE_STATES } from '@rpldy/uploady';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import FilePondImagePreview from './FilePondImagePreview';
import FilePondListItemFile from './FilePondListItemFile';
import { useFilePond } from './context/FilePondContext';
import useFileItem from './hooks/useFileItem';
import useFileValidateSize from './hooks/useFileValidateSize';
import useFileValidateType from './hooks/useFileValidateType';
import { FileItem } from './types';

import { fetchBlob } from './utils/fetchBlob';
import { isPreviewableImage } from './utils/isPreviewableImage';
export interface FilePondListItemProps {
  item: FileItem;
}

export const FilePondListItem = (props: FilePondListItemProps) => {
  const { item } = props;

  const id = item?.id ?? '1';

  const { file, state } = useFileItem(id);

  const [fetchStatus, setFetchStatus] = useState<
    'idle' | 'fetching' | 'fetched'
  >('idle');

  useFileValidateType(id);
  useFileValidateSize(id);

  const { imagePreview, setFiles } = useFilePond();

  useEffect(() => {
    if (file && file.url && !file.file && fetchStatus !== 'fetching') {
      setFetchStatus('fetching');
      fetchBlob(file.url)
        .then((value) => {
          setFiles((draft) => {
            const f = draft.find((f) => f.id === id);
            if (f) {
              f.file = value;
              f.state = FILE_STATES.FINISHED;
            }
          });
        })
        .then(() => {
          setFetchStatus('fetched');
        });
    }
  }, [id, setFiles, file, fetchStatus]);

  if (imagePreview && isPreviewableImage(file?.file)) {
    return <FilePondImagePreview id={id} />;
  }

  return (
    <Container state={state}>
      <FilePondListItemFile id={id} />
      <div className="file-panel" style={{ height: 40 }}></div>
    </Container>
  );
};

const Container = styled.div<{ state: FILE_STATES }>`
  border-radius: 0.5em;
  margin: 0.25em;
  position: relative;

  .file-panel {
    pointer-events: none;
    z-index: 0;
    border-radius: 0.5em;

    background-color: ${({ state }) => {
      switch (state) {
        case FILE_STATES.FINISHED:
          return '#369763';
        case FILE_STATES.ABORTED:
        case FILE_STATES.CANCELLED:
        case FILE_STATES.ERROR:
          return '#c44e47';
        default:
          return '#64605e';
      }
    }};
  }
`;

export default FilePondListItem;
