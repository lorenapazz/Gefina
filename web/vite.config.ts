
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import tailwinddocss from "@tailwindcss/vite"

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': 'http://localhost:3001'
        }
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/test.setup.ts']
    }
});
