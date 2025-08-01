import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@dimforge/rapier2d': './src/test/mocks/rapier2d.ts',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        ...configDefaults.coverage.exclude,
        'src/main.ts',
        'src/test/**',
      ],
    },
    // Mock canvas and WebGL
    server: {
      deps: {
        inline: ['vitest-canvas-mock'],
      },
    },
    // Disable threads to avoid issues with canvas mocking
    pool: 'forks',
  },
});