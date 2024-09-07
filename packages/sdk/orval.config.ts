import { defineConfig } from 'orval';

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
        title: (title) => `${title}Api`,
        // mutator: {
        //   path: '../customInstance.ts',U
        //   name: 'customInstance'
        // },
        transformer: (options) => {
          const firstTag = options.tags[0] || 'Default';
          // const secondTag = options.tags[1] || 'Default';
          const firstTagCamelCase = firstTag[0].toUpperCase() + firstTag.slice(1);

          options = {
            ...options,
            // only generate one file per tag
            tags: [firstTag],
            operationName: options.operationName.replace(firstTagCamelCase, '').replace(/Api/, '')
          };

          return options;
        }
      },
      client: 'axios',
      mode: 'tags',
      target: './api/index.ts',
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
          const firstTag = options.tags[0] || 'Default';

          options = {
            ...options,
            tags: [firstTag]
          };

          return options;
        }
      },
      client: 'zod',
      mode: 'single',
      target: './zod/index.ts',
      workspace: './src/'
    }
  }
});
