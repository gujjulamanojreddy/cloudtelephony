import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    cors: {
      origin: true,
      credentials: true
    },
    strictPort: true,
    hmr: {
      port: 5174,
      host: 'localhost'
    },
    // 👇 Add this section
    allowedHosts: ['telephony.jayaprakash.cloud']
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    cors: {
      origin: true,
      credentials: true
    }
  },
  optimizeDeps: {
    include: ['lucide-react'],
    force: true
  },
  publicDir: 'public',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          tinymce: ['tinymce'],
          'lucide-react': ['lucide-react']
        }
      }
    }
  }
});
