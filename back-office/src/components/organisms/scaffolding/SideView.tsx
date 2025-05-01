import { X } from 'lucide-react';
import { ReactNode } from 'react';

import { Button } from '@/components/shadcn/button';
import { ScrollArea } from '@/components/shadcn/scroll-area';
import { cn } from '@/utils/common';

interface SideViewProps {
  children: ReactNode;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md';
}

export const SideView = ({ children, onClose, title, size = 'sm' }: SideViewProps) => {
  return (
    <div
      className={cn(
        'fixed right-0 top-0 h-full z-50',
        'w-full',
        size === 'sm' ? 'md:w-96' : 'md:w-192',
        'animate-in slide-in-from-right duration-300',
        'bg-white',
        'border-l'
      )}
      style={{
        boxShadow: '-12px 0 24px -8px rgba(0,0,0,0.08)',
      }}
    >
      <div className="flex flex-row-reverse items-center justify-between h-16 px-4">
        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-destructive/10">
          <X className="h-4 w-4" />
        </Button>
        {title && <span className="font-semibold text-lg truncate mr-2">{title}</span>}
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-4">{children}</div>
      </ScrollArea>
    </div>
  );
};
