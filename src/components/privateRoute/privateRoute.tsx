import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';

import {useAuth} from '../../hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute = function ({children, ...rest}: PrivateRouteProps): JSX.Element {
  const {auth} = useAuth();
  const location = useLocation();

  return (
    <>
      {auth ? (
        children
      ) : (
        <Navigate to="/" state={{ from: location }} replace />
      )}
    </>
  );
};

export {PrivateRoute};
