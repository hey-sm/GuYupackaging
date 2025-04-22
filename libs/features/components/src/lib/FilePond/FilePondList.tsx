import styled from 'styled-components';
import FilePondListItem from './FilePondListItem';
import { FileItemProvider } from './context/FileItemContext';
import { useFilePond } from './context/FilePondContext';

export const FilePondList = () => {
  const { files } = useFilePond();
  window.console.log(files);
  return (
    <Container>
      <>
        {(
          files ?? [
            {
              url: 'https://cdn.pixabay.com/photo/2023/09/04/23/58/woman-8233937_1280.jpg',
            },
          ]
        ).map((v) => (
          <FileItemProvider key={v?.id} item={v}>
            <FilePondListItem key={v?.id} item={v} />
          </FileItemProvider>
        ))}
      </>
    </Container>
  );
};

const Container = styled.div`
  padding: 0.75rem;
`;

export default FilePondList;
