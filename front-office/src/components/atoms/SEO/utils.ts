import { urlJoin } from '../../../../utils/url';

export function getPathWithoutTrailingSlash(baseUrl: string, appendPath?: string): string {
  let pathToFormat = baseUrl;
  if (appendPath) {
    pathToFormat = urlJoin(baseUrl, appendPath);
  }
  return pathToFormat.split('?')[0];
}
