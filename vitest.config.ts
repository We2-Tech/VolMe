import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    server: {
      deps: {
        // MUI v9 ESM files do bare directory imports that Node ESM rejects;
        // inlining through Vite applies the alias below to fix resolution
        inline: [/@mui/],
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // MUI v9 ESM imports this as a directory path, which Node ESM rejects
      'react-transition-group/TransitionGroupContext': resolve(
        __dirname,
        'node_modules/react-transition-group/cjs/TransitionGroupContext.js',
      ),
    },
  },
})
