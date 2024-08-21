export function buildFactory<T>(schema: T) {
  return (args?: Partial<T>): T => ({
    ...schema,
    ...args,
  });
}
