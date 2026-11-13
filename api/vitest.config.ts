
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    // Configura o plugin do React
    plugins: [react()],

    // Configura o servidor de desenvolvimento
    server: {
        proxy: {
            // Encaminha as requisições da API para o backend
            '/api': 'http://localhost:3001'
        }
    },

    // Configura os testes automatizados
    test: {
        environment: 'jsdom',
        setupFiles: ['./test.setup.ts']
    }
});
