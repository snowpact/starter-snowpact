import { DefaultValues } from 'react-hook-form';
import { z } from 'zod';

export function isOptional(schema: z.ZodTypeAny): boolean {
  return schema instanceof z.ZodOptional;
}

export function unwrapSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  if (schema instanceof z.ZodOptional) {
    return schema.unwrap();
  }
  return schema;
}

export function omitFields<T extends z.ZodObject<z.ZodRawShape>, K extends keyof z.infer<T>>(
  schema: T,
  fieldsToExclude: K[]
) {
  const shape = schema._def.shape();
  const newShape = { ...shape };

  fieldsToExclude.forEach(key => {
    delete newShape[key as string];
  });

  return z.object(newShape) as T;
}

export function initializeDefaultValues<T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  providedValues: Partial<z.infer<T>> = {}
): DefaultValues<z.infer<T>> {
  const shape = schema._def.shape();
  const defaultValues = Object.entries(shape).reduce(
    (acc, [key, field]) => {
      const actualSchema = unwrapSchema(field as z.ZodTypeAny);
      if (actualSchema instanceof z.ZodString) acc[key] = '';
      else if (actualSchema instanceof z.ZodNumber) acc[key] = undefined;
      else if (actualSchema instanceof z.ZodBoolean) acc[key] = false;
      else if (actualSchema instanceof z.ZodDate) acc[key] = null;
      else if (actualSchema instanceof z.ZodEnum) acc[key] = null;
      return acc;
    },
    {} as Record<string, unknown>
  );

  return { ...defaultValues, ...providedValues } as DefaultValues<z.infer<T>>;
}
