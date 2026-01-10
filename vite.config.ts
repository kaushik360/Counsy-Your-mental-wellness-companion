import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Convert to function to access 'mode' for loading env vars
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // Cast process to any to avoid TS error about missing cwd() method in some environments
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Priority: 
  // 1. System Environment Variable (Vercel/Netlify) -> process.env.GROQ_API_KEY
  // 2. .env file variable -> env.GROQ_API_KEY
  // 3. Fallback to generic API_KEY for backward compatibility
  const apiKey = process.env.GROQ_API_KEY || env.GROQ_API_KEY || process.env.API_KEY || env.API_KEY || env.VITE_API_KEY;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"),
      },
    },
    define: {
      // Polyfill process.env.API_KEY so it works in the browser
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  };
});