import { ReactNode } from 'react';

import { SideView } from '../organisms/scaffolding/SideView';
import { TopBar } from '../organisms/scaffolding/TopBar';

import { cn } from '@/utils/common';

type DashboardPageLayoutProps = {
  children: ReactNode;
  title: string | undefined;
  topActions?: ReactNode[] | null;
  sideView?: ReactNode;
  sideViewTitle?: string;
  sideViewSize?: 'sm' | 'md';
  onCloseSideView?: () => void;
};

export const DashboardPageLayout = ({
  children,
  title,
  topActions,
  sideView,
  sideViewTitle,
  sideViewSize = 'sm',
  onCloseSideView,
}: DashboardPageLayoutProps) => {
  return (
    <div className="flex flex-1">
      <div
        className={cn(
          'flex-1 flex-col transition-all duration-300',
          sideView ? 'bg-gray-50 md:mr-96' : 'bg-white mr-0'
        )}
      >
        <TopBar actions={topActions} title={title} />
        <div className="flex flex-col flex-1 items-center p-4">{children}</div>
      </div>
      {sideView && (
        <SideView onClose={() => onCloseSideView?.()} title={sideViewTitle} size={sideViewSize}>
          {sideView}
        </SideView>
      )}
    </div>
  );
};
