import styled from 'styled-components';
import FilePondListItemAction from './FilePondListItemAction';
import FilePondListItemStatus from './FilePondListItemStatus';
import useFileItem from './hooks/useFileItem';
import useFileValidateSize from './hooks/useFileValidateSize';
import useFileValidateType from './hooks/useFileValidateType';
import { toNaturalFileSize } from './utils/toNaturalFileSize';

interface FilePondListItemFileProps {
  id: string;
}
export const FilePondListItemFile = (props: FilePondListItemFileProps) => {
  const { id } = props;

  const { file } = useFileItem(id);

  useFileValidateType(id);
  useFileValidateSize(id);

  return (
    <Container>
      <div className="file-info mr-2">
        <div className="file-info-main">{file?.name}</div>
        <div className="file-info-sub">
          {!!file?.file?.size && toNaturalFileSize(file?.file?.size)}
        </div>
      </div>
      <div className="mr-2">
        <FilePondListItemStatus id={id} />
      </div>
      <FilePondListItemAction id={id} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100%;
  align-items: flex-start;
  padding: 0.5625em;
  color: #fff;

  display: flex;
  align-items: center;
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  .file-info {
    min-width: 0;
    flex: 1;

    .file-info-main {
      font-size: 0.75em;
      line-height: 1.2;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      width: 100%;
    }

    .file-info-sub {
      font-size: 0.625em;
      opacity: 0.5;
      transition: opacity 0.25s ease-in-out;
      white-space: nowrap;
    }
  }

  .file-action-button,
  .action-remove-item {
    font-size: 1rem;
    width: 1.625rem;
    height: 1.625rem;
    border: none;
    outline: none;
    will-change: transform, opacity;

    color: #fff;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 0 0 rgb(255 255 255 / 0%);
    transition: box-shadow 0.25s ease-in;

    &:hover,
    &:focus {
      box-shadow: 0 0 0 0.125rem rgb(255 255 255 / 90%);
    }
  }
`;

export default FilePondListItemFile;
