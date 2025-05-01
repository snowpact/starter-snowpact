/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, ReactElement } from 'react';
import { Path, useForm, UseFormSetError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TypeOf, z } from 'zod';

import { getFieldElement } from './mapping';
import { isOptional, unwrapSchema, initializeDefaultValues } from './utils';

import { Button } from '@/components/shadcn/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/form';
import { useApiMutation } from '@/hooks/useApi';

const isDevelopment = process.env.NODE_ENV === 'development';

export interface SelectOption {
  label: string;
  value: string;
}

export interface FieldConfig {
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  hidden?: boolean;
  type?: 'text' | 'password' | 'email' | 'number' | 'textarea' | 'select';
  options?: SelectOption[];
  render?: (field: { value: any; onChange: (value: any) => void }) => ReactElement;
}

export interface MagicFormProps<T extends z.ZodObject<any, any>, K> {
  schema: T;
  onSubmit?: (values: z.infer<T>) => void | Promise<void>;
  overrides?: Partial<Record<keyof z.infer<T>, FieldConfig>>;
  defaultValues?: Partial<z.infer<T>>;
  submitEndpoint?: (values: z.infer<T>) => Promise<K>;
  fetchDefaultValuesEndpoint?: () => Promise<Partial<z.infer<T>>>;
  onSuccess?: (data: K, variables: z.infer<T>, context: unknown) => void;
  onError?: (
    setFormError: UseFormSetError<z.infer<T>>,
    error: unknown,
    variables: z.infer<T>,
    context: unknown
  ) => void;
  omitFields?: string[];
  debug?: boolean;
}

export function MagicForm<T extends z.ZodObject<any, any>, K>({
  schema,
  onSubmit,
  overrides = {},
  defaultValues = {},
  submitEndpoint,
  fetchDefaultValuesEndpoint,
  onSuccess,
  onError,
  omitFields = [],
  debug = false,
}: MagicFormProps<T, K>) {
  const { t } = useTranslation();
  const [isFetchingDefaultValues, setIsFetchingDefaultValues] = useState(false);

  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: initializeDefaultValues(schema, defaultValues),
    disabled: isFetchingDefaultValues,
  });

  useEffect(() => {
    const fetchDefaults = async () => {
      setIsFetchingDefaultValues(true);
      const values = await fetchDefaultValuesEndpoint!();

      Object.entries(values).forEach(([key, value]) => {
        form.setValue(key as Path<z.infer<T>>, value as any);
      });
      setIsFetchingDefaultValues(false);
    };

    if (fetchDefaultValuesEndpoint) {
      fetchDefaults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDefaultValuesEndpoint]);

  const { mutate: mutateEndpoint, isPending } = useApiMutation<K, z.infer<T>>(
    async values => {
      const data = await submitEndpoint!(values);
      return { data };
    },
    {
      onSuccess,
      onError: (error, variables, context) => {
        onError?.(form.setError, error, variables, context);
      },
    }
  );

  const handleSubmit = async (values: z.infer<T>) => {
    if (submitEndpoint) {
      mutateEndpoint(values);
    } else {
      onSubmit?.(values);
    }
  };

  const shape = schema._def.shape();

  if (isDevelopment && debug) {
    console.log('values', form.getValues());
    console.log('errors', form.formState.errors);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {Object.entries(shape)
          .filter(([key]) => !omitFields.includes(key))
          .map(([key, field]) => {
            const actualSchema = unwrapSchema(field as z.ZodTypeAny);
            const fieldConfig: FieldConfig = {
              label: t(`data.${key}`),
              ...(overrides[key] ?? {}),
            };

            return (
              <FormField
                key={key}
                control={form.control}
                name={key as Path<TypeOf<T>>}
                render={({ field: formField }) => {
                  const element = fieldConfig.render
                    ? fieldConfig.render({ value: formField.value, onChange: formField.onChange })
                    : getFieldElement(actualSchema, formField, fieldConfig);

                  if (!element) {
                    console.warn(`No component found for field: ${key}`);
                    return <div hidden>{key}</div>;
                  }

                  if (fieldConfig.hidden) {
                    return element;
                  }

                  return (
                    <FormItem>
                      <FormLabel>
                        {fieldConfig.label || key}
                        {!isOptional(field as z.ZodTypeAny) && ' *'}
                      </FormLabel>
                      <FormControl>{element}</FormControl>
                      {fieldConfig.description && (
                        <FormDescription>{fieldConfig.description}</FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            );
          })}
        <Button type="submit" loading={isPending} disabled={isFetchingDefaultValues}>
          {t('common.submit')}
        </Button>
      </form>
    </Form>
  );
}
