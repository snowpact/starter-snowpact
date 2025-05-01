import { ReactNode } from 'react';

import { Card as ShadcnCard } from '@/components/shadcn/card';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return <ShadcnCard className={className}>{children}</ShadcnCard>;
};
