import { ArrowUpCircleIcon } from 'lucide-react';
import * as React from 'react';
import { NavLink } from 'react-router-dom';

import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/shadcn/sidebar';

export interface NavItem {
  title: string;
  to: string;
  icon: React.ElementType;
}

export interface GrouppedNavItem {
  title: string;
  items: NavItem[];
}

interface AppSidebarProps extends React.ComponentProps<typeof SidebarContainer> {
  menu: GrouppedNavItem[];
  appTitle: string;
  onNavItemClick?: (item: NavItem) => void;
  topElement?: React.ReactNode;
  bottomElement?: React.ReactNode;
}

export function AppSidebar({
  appTitle,
  menu,
  onNavItemClick,
  topElement,
  bottomElement,
  ...props
}: AppSidebarProps) {
  const { open } = useSidebar();

  return (
    <SidebarContainer collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
          <NavLink to="/">
            <ArrowUpCircleIcon className="h-5 w-5" />
            <span className="text-base font-semibold">{appTitle}</span>
          </NavLink>
        </SidebarMenuButton>
        {topElement && topElement}
      </SidebarHeader>
      <SidebarContent>
        {menu.map(group => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={{
                        children: item.title,
                        hidden: open,
                      }}
                      onClick={() => onNavItemClick?.(item)}
                      className="px-2.5 md:px-2 group-data-[collapsible=expanded]:w-full"
                    >
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `flex items-center gap-2 ${isActive ? '[&>svg]:text-sidebar-primary [&>span]:text-sidebar-primary' : ''}`
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="mt-auto pb-4">
        <SidebarSeparator />
        {bottomElement}
      </SidebarFooter>
    </SidebarContainer>
  );
}
