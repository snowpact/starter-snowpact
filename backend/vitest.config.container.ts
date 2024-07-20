import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    silent: false,
    globals: true,
    environment: 'node',
    globalSetup: './src/tests/vitest.globalSetup.ts',
    setupFiles: ['./src/tests/vitest.containers.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'github-actions'],
    },
    include: ['**/*.integration.test.ts', '**/*.repository.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/cypress/**'],
    // SEQUENTIAL TESTS
    isolate: false, // This ensures each test file runs in a separate process
    sequence: {
      // This ensures tests are run sequentially
      concurrent: false,
    },
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
