import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['default', ['html', { outputFile: 'reports/index.html' }]],
    clean: true,
  },
});
