import { ChevronsUpDown, type LucideIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/shadcn/sidebar';

export interface Account {
  name: string;
  logo: LucideIcon;
  description?: string;
  active: boolean;
}

export interface AccountSwitcherProps {
  accounts: Account[];
  onAccountChange?: (account: Account) => void;
  title?: string;
}

export function AccountSwitcher({ accounts, onAccountChange, title }: AccountSwitcherProps) {
  const { isMobile } = useSidebar();

  const handleAccountChange = (account: Account) => {
    onAccountChange?.(account);
  };

  const activeAccount = accounts.find(account => account.active);
  if (!activeAccount) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeAccount.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeAccount.name}</span>
                <span className="truncate text-xs">{activeAccount.description}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            {title && (
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                {title}
              </DropdownMenuLabel>
            )}
            {accounts.map(account => (
              <DropdownMenuItem
                key={account.name}
                onClick={() => handleAccountChange(account)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <account.logo className="size-3.5 shrink-0" />
                </div>
                {account.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
