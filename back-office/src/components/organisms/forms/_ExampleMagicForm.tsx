import { z } from 'zod';

import { MagicForm } from '@/components/nuclei/MagicForm';
import { Textarea } from '@/components/shadcn/textarea';

const userTypeOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'manager', label: 'Manager' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'guest', label: 'Guest' },
];

const simpleBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  description: z.string().min(1).optional(),
  duration: z.number().optional(),
  admin: z.boolean().optional(),
  date: z.date().optional(),
  userType: z.enum(['admin', 'manager', 'editor', 'viewer', 'guest']).optional(),
  customSelectId: z.string().optional(),
});

const formSchema = simpleBody;

export const ExampleMagicForm = () => {
  return (
    <MagicForm
      schema={formSchema}
      onSubmit={values => console.log(values)}
      onSuccess={() => {
        console.log('success');
      }}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onError={(setError, _error) => {
        setError('email', {
          type: 'manual',
          message: 'test',
        });
      }}
      overrides={{
        email: {
          label: 'Email Address',
          description: 'Your primary email',
          placeholder: 'john@example.com',
        },
        password: {
          type: 'password',
        },
        description: {
          type: 'textarea',
          render: ({ value, onChange }) => (
            <Textarea value={value} onChange={e => onChange(e.target.value)} placeholder="DDDD" />
          ),
        },
        userType: {
          label: 'User Type',
          description: 'Select the type of user',
          options: userTypeOptions,
          placeholder: 'Select a user type',
        },
        date: {
          disabled: true,
        },
        customSelectId: {
          type: 'select',
          options: [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
            { value: '3', label: 'Option 3' },
          ],
          placeholder: 'Select an option',
        },
      }}
      defaultValues={{
        email: 'john@example.com',
        date: new Date(),
        userType: 'viewer',
      }}
    />
  );
};
