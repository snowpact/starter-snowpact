import { ReactNode } from 'react';

import { Separator } from '@/components/shadcn/separator';
import { SidebarTrigger } from '@/components/shadcn/sidebar';

interface TopBarProps {
  actions?: ReactNode[] | null;
  title?: string;
}

export const TopBar = ({ actions = [], title }: TopBarProps) => {
  return (
    <header className="flex h-14 items-center border-b">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
      </div>
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2 px-3">
          {actions.map((action, index) => (
            <div key={`action-${index}`}>{action}</div>
          ))}
        </div>
      )}
    </header>
  );
};
