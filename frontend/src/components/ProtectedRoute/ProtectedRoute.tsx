import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps extends React.PropsWithChildren {
  isAllowed: boolean | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({isAllowed, children}) => {
  if (!isAllowed) {
    return <Navigate to="/login"/>;
  }

  return children as React.ReactElement;
};

export default ProtectedRoute;