import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from '@tanstack/react-start/config'
import TanStackRouterVite from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  tsr: {
    appDirectory: 'src',
  },
  vite: {
    plugins: [
      TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
      tsconfigPaths({
        projects: ['./tsconfig.json'],
      }),
      react(),
      tailwindcss(),
    ],
  },
})
