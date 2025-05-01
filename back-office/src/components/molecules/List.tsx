import { ReactNode } from 'react';

import { cn } from '@/utils/common';

export interface ListItem {
  id: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  metadata?: {
    date?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  className?: string;
  itemClassName?: string;
}

export const List = <T,>({
  items,
  renderItem,
  className = '',
  itemClassName = '',
}: ListProps<T>) => {
  return (
    <ul className={`flex flex-col ${className}`}>
      {items.map((item, index) => (
        <li
          key={index}
          className={cn(
            'flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            itemClassName
          )}
        >
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
};
