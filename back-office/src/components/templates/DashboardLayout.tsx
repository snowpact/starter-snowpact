import { Command, FileText, Settings } from 'lucide-react';
import { ReactNode } from 'react';

import { Account, AccountSwitcher } from '../organisms/scaffolding/AccountSwitcher';
import { type NavItem, AppSidebar } from '../organisms/scaffolding/AppSidebar';
import { NavUser } from '../organisms/scaffolding/NavUser';

import { SidebarInset, SidebarProvider } from '@/components/shadcn/sidebar';
import { useAuthContext } from '@/contexts/AuthContext';

const DEFAULT_MENU: NavItem[] = [
  { title: 'Single Page', to: '/single-page', icon: FileText },
  { title: 'List Page', to: '/list-page', icon: Settings },
];

// const DEFAULT_APP_MENU: NavItem[] = [{ title: 'Blogpost List', to: '/blogpost', icon: FileText }];

const DEFAULT_ACCOUNTS: Account[] = [{ name: 'test', logo: Command, active: true }];

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { clearUser, user } = useAuthContext();

  const handleOnLogout = () => {
    clearUser();
  };

  return (
    <SidebarProvider>
      <AppSidebar
        appTitle="Back Office"
        menu={[
          { title: 'Menu', items: DEFAULT_MENU },
          // { title: 'App', items: DEFAULT_APP_MENU },
        ]}
        topElement={<AccountSwitcher accounts={DEFAULT_ACCOUNTS} />}
        bottomElement={user ? <NavUser email={user.email} onLogout={handleOnLogout} /> : null}
      />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};
