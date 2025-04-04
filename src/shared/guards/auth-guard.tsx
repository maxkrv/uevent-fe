import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../../modules/auth/queries/use-auth.query';

export const AuthGuard: FC<PropsWithChildren> = ({ children }) => {
  const user = useAuth();
  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
