import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change 'MLOps-Roadmap' to whatever your GitHub repo name is
export default defineConfig({
  plugins: [react()],
  base: '/MLOps-Roadmap/',
})
