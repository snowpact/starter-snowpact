export function urlJoin(...parts: string[]): string {
  if (parts.length === 0) {
    return '';
  }

  const joined: string[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (typeof part === 'string') {
      joined.push(part);
    }
  }

  const result = joined.join('/');

  const cleanedResult = result.replace(/([^:]\/)\/+/g, '$1').replace(/\/+$/, '');

  return cleanedResult === '' && parts.some((part) => part === '/') ? '/' : cleanedResult;
}
