import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@koda/core': path.resolve(__dirname, '../../src'),
            '@koda/ui': path.resolve(__dirname, '../../../../koda-ui/src'),
        },
    },
    build: {
        outDir: 'dist',
    }
});
