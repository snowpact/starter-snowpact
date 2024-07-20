import { defineConfig } from 'orval';

export default defineConfig({
  axios: {
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
    input: {
      target: '../http/openApi/openapi.json',
      validation: true,
    },
    output: {
      mode: 'split',
      target: './axios/index.ts',
      workspace: './sdk/',
    },
  },
  reactQuery: {
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
    input: {
      target: '../http/openApi/openapi.json',
      validation: true,
    },
    output: {
      client: 'react-query',
      mode: 'split',
      target: './react-query/index.ts',
      workspace: './sdk/',
    },
  },
  zod: {
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
    input: {
      target: '../http/openApi/openapi.json',
      validation: true,
    },
    output: {
      client: 'zod',
      mode: 'single',
      target: './zod/index.ts',
      workspace: './src/',
    },
  },
});
