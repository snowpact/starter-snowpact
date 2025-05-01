/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';

import type { FieldConfig, SelectOption } from './MagicForm';

import { Select } from '@/components/atoms/Select';
import { DatePicker } from '@/components/molecules/DatePicker';
import { Input } from '@/components/shadcn/input';
import { Switch } from '@/components/shadcn/switch';
import { Textarea } from '@/components/shadcn/textarea';

export function getFieldElement(schema: z.ZodTypeAny, field: any, config?: FieldConfig) {
  if (config?.hidden) {
    return <input type="hidden" {...field} />;
  }

  if (schema instanceof z.ZodEnum || (config?.type === 'select' && config?.options)) {
    const options =
      config?.options ||
      ((schema instanceof z.ZodEnum
        ? schema.options.map((value: string) => ({ label: value, value }))
        : []) as SelectOption[]);

    const placeholder = config?.placeholder || `---------`;

    return (
      <Select
        options={options}
        value={field.value}
        onChange={field.onChange}
        disabled={config?.disabled}
        placeholder={placeholder}
      />
    );
  }

  if (schema instanceof z.ZodString) {
    if (config?.type === 'textarea') {
      return <Textarea {...field} placeholder={config?.placeholder} disabled={config?.disabled} />;
    }

    return (
      <Input
        type={config?.type || 'text'}
        placeholder={config?.placeholder}
        disabled={config?.disabled}
        {...field}
      />
    );
  }

  if (schema instanceof z.ZodNumber) {
    return (
      <Input
        type="number"
        placeholder={config?.placeholder}
        disabled={config?.disabled}
        {...field}
        onChange={e => field.onChange(Number(e.target.value))}
      />
    );
  }

  if (schema instanceof z.ZodBoolean) {
    return (
      <Switch disabled={config?.disabled} checked={field.value} onCheckedChange={field.onChange} />
    );
  }

  if (schema instanceof z.ZodDate) {
    return <DatePicker disabled={config?.disabled} date={field.value} onChange={field.onChange} />;
  }

  return null;
}
