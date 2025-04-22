import { useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useSessionStore } from './auth.store';

export const ProtectedRoute = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  // const session = useSessionStore(useCallback((state) => state.session, []));
  // if (!session) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
