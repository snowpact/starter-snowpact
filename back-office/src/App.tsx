import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

import { ConfirmDialogProvider } from '@/components/molecules/ConfirmDialog/ConfirmDialogProvider';
import { Router } from '@/containers/router/Router';
import { AuthProvider } from '@/contexts/AuthContext';

import './configs/i18n';
import './configs/zod';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ConfirmDialogProvider>
            <Router />
          </ConfirmDialogProvider>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
