import { ReactNode, useState } from 'react';

import { ExampleMagicDataTable } from '@/components/organisms/dataTables/_ExampleMagicDataTable';
import { ExampleMagicForm } from '@/components/organisms/forms/_ExampleMagicForm';
import { Button } from '@/components/shadcn/button';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';

export const ExampleListPage = () => {
  const [sideView, setSideView] = useState<ReactNode>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const handleRowClick = (_item: any) => {
    // console.log(item);
    setSideView(<ExampleMagicForm />);
  };

  return (
    <DashboardPageLayout
      topActions={[<Button onClick={() => setSideView(<ExampleMagicForm />)}>Add</Button>]}
      sideView={sideView}
      title="Example List"
      onCloseSideView={() => setSideView(null)}
    >
      <ExampleMagicDataTable onRowClick={handleRowClick} />
    </DashboardPageLayout>
  );
};
