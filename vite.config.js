import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change 'mlops-roadmap' to whatever your GitHub repo name is
export default defineConfig({
  plugins: [react()],
  base: '/mlops-roadmap/',
})
