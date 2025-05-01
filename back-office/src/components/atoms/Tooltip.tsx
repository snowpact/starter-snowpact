import * as React from 'react';

import {
  Tooltip as TooltipBase,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip';

export type Side = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode | null;
  disableTooltip?: boolean;
  side?: Side;
}

export const Tooltip = ({ children, content, disableTooltip = false }: TooltipProps) => {
  if (!content || !children) {
    return null;
  }

  if (disableTooltip) {
    return children;
  }

  return (
    <TooltipProvider>
      <TooltipBase>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </TooltipBase>
    </TooltipProvider>
  );
};
