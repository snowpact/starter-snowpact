# Back Office Architecture and Development Guide

## Chapter 1: Component Architecture with shadcn

### Adding shadcn Components

We use shadcn components as our base UI library. To add new components:

```bash
pnpm dlx shadcn@latest add <component-name>
# Example: pnpm dlx shadcn@latest add select
```

The configuration for shadcn is managed in `components.json`, which defines:
- Component styling
- Base directory structure
- Tailwind configuration
- React configuration

### Component Abstraction Pattern

We follow a layered component architecture:

1. **shadcn components** (`@/components/shadcn/`)
   - Base components from shadcn
   - Never used directly in pages/features
   - Example: `select.tsx`, `button.tsx`

2. **Atomic components** (`@/components/atoms/`)
   - Abstractions over shadcn components
   - Add business-specific props and behaviors
   - Maintain consistent styling
   - Example:
   ```tsx
   // atoms/Select.tsx
   import { Select as ShadcnSelect } from '@/components/shadcn/select';

   export function Select({ value, onChange, options }) {
     return (
       <ShadcnSelect value={value} onValueChange={onChange}>
         {/* Additional business logic/styling */}
       </ShadcnSelect>
     );
   }
   ```

3. **Molecular/Organism components** (`@/components/molecules/`, `@/components/organisms/`)
   - Compose atomic components
   - Implement feature-specific logic
   - Example: Complex forms, data tables

This architecture ensures:
- Easy component library updates
- Consistent styling and behavior
- Separation of concerns
- Type safety
- Reusability

## Chapter 2: Form Implementation

We use shadcn's form components with react-hook-form and Zod for form management:

### Basic Form Setup

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Define schema with Zod
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// 2. Create form with react-hook-form
const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    email: '',
    password: '',
  },
});

// 3. Use shadcn Form components
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

Key benefits:
- Type-safe form handling
- Built-in validation with Zod
- Accessible form components
- Consistent error handling
- Clean component composition

[To be continued with more form patterns and examples...] 