import { defineConfig } from 'orval';

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

export default defineConfig({
  axios: {
    hooks: {
      afterAllFilesWrite: 'prettier --write'
    },
    input: {
      target: '../../backend/src/entrypoints/api/openApi/openapi.json',
      validation: true
    },
    output: {
      override: {
        title: (title) => `${title}ApiCollection`,
        transformer: (options) => {
          options = {
            ...options,
            // only generate one file per tag
            tags: [options.tags[0] || 'Default']
          };

          return options;
        }
      },
      client: 'axios',
      mode: 'tags-split',
      target: './',
      schemas: './models',
      fileExtension: '.api.ts',
      workspace: './src/'
    }
  },
  reactQuery: {
    hooks: {
      afterAllFilesWrite: 'prettier --write'
    },
    input: {
      target: '../../backend/src/entrypoints/api/openApi/openapi.json',
      validation: true
    },
    output: {
      override: {
        transformer: (options) => {
          options = {
            ...options,
            tags: [options.tags[0] || 'Default'],
            operationName: options.operationName + 'Api'
          };

          return options;
        },
        query: {
          usePrefetch: true
        }
      },
      allParamsOptional: true,
      urlEncodeParameters: true,
      optionsParamRequired: true,
      client: 'react-query',
      mode: 'tags-split',
      target: './',
      schemas: './models',
      fileExtension: '.query.ts',
      workspace: './src/'
    }
  },
  zod: {
    hooks: {
      afterAllFilesWrite: 'prettier --write'
    },
    input: {
      target: '../../backend/src/entrypoints/api/openApi/openapi.json',
      validation: true
    },
    output: {
      override: {
        transformer: (options) => {
          options = {
            ...options,
            tags: [options.tags[0] || 'Default'],
            operationName: 'zod' + capitalize(options.operationName)
          };

          return options;
        }
      },
      client: 'zod',
      mode: 'tags-split',
      target: './',
      schemas: './models',
      fileExtension: '.zod.ts',
      workspace: './src/'
    }
  }
});
