import { Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedDashboardRoute } from '../guards/ProtectedDashboardRoute';
import { PublicRoute } from '../guards/PublicRoute';
import { ExampleListPage } from '../pages/_ExampleListPage';
import { ExampleSinglePage } from '../pages/_ExampleSinglePage';

import { AuthPage } from '@/containers/pages/AuthPage';

export const Router = () => {
  return (
    <Routes>
      <Route element={<PublicRoute redirectIfLogged />}>
        <Route path="/login" element={<AuthPage />} />
      </Route>
      <Route element={<ProtectedDashboardRoute />}>
        <Route path="/" element={<ExampleSinglePage />} />
        <Route path="/single-page" element={<ExampleSinglePage />} />
        <Route path="/list-page" element={<ExampleListPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
