import { ExampleMagicForm } from '@/components/organisms/forms/_ExampleMagicForm';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';

export const ExampleSinglePage = () => {
  return (
    <DashboardPageLayout title="Example Single">
      <ExampleMagicForm />
    </DashboardPageLayout>
  );
};
