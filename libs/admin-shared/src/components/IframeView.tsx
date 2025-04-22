/* eslint-disable jsx-a11y/iframe-has-title */
import qs from 'qs';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useSessionStore } from '../auth';

const IframeView = () => {
  const { search } = useLocation();
  const session = useSessionStore(useCallback((state) => state.session, []));

  const iframeUrl = useMemo(() => {
    const query = qs.parse(search, { ignoreQueryPrefix: true });
    return query['url'] as string;
  }, [search]);

  const authUrl = useMemo(() => {
    const params = iframeUrl?.split('?')[1];
    return params?.length > 0
      ? `${iframeUrl}&Authorization=${session}`
      : `${iframeUrl}?Authorization=${session}`;
  }, [iframeUrl, session]);

  return (
    <Container className="page-container">
      <iframe src={iframeUrl} allowFullScreen={true} />
    </Container>
  );
};

const Container = styled.div`
  > iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

export default IframeView;
