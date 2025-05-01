import { Navigate, Outlet } from 'react-router-dom';

import { TopLoadingBar } from '@/components/atoms/TopLoadingBar';
import { PublicLayout } from '@/components/templates/PublicLayout';
import { useAuthContext } from '@/contexts/AuthContext';

// A wrapper for <Route> that redirects to homepage if already logged
type PublicRouteProps = {
  redirectIfLogged?: boolean;
};

export const PublicRoute = ({ redirectIfLogged = false }: PublicRouteProps) => {
  const { isReady, user } = useAuthContext();

  if (!isReady) {
    return <TopLoadingBar />;
  }

  if (!!user && redirectIfLogged) {
    return <Navigate to="/" />;
  }

  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
};
