import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Set 'base' to your GitHub repo name if deploying to GitHub Pages:
// e.g. base: '/diksha-trek/' 
// Leave as '/' for local dev or Cloudflare Pages
export default defineConfig({
  base: '/diksha/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
