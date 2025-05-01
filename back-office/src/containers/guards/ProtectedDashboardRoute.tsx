import { Navigate, Outlet } from 'react-router-dom';

import { TopLoadingBar } from '@/components/atoms/TopLoadingBar';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { useAuthContext } from '@/contexts/AuthContext';

// A wrapper for <Route> that redirects to login if not logged

export const ProtectedDashboardRoute = () => {
  const { isReady, user } = useAuthContext();

  if (!isReady) {
    return <TopLoadingBar />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};
