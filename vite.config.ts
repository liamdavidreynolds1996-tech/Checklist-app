import { defineConfig } from 'vite'
import react from '@vitejs/react-refresh' // or @vitejs/plugin-react

export default defineConfig({
  plugins: [react()],
  base: '/Checklist-app/', // This matches your repository name exactly
})
