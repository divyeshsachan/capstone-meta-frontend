import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration.
// The `test` block configures Vitest, which runs the unit tests in src/tests
// with a jsdom DOM implementation so React Testing Library can render components.
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    css: false,
  },
});
