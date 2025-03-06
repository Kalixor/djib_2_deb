import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    export default defineConfig({
      plugins: [react()],
      optimizeDeps: {
        include: ['react', 'react-dom', 'recharts']
      },
	  server: {
		allowedHosts: ['djib_poc.karl-fixto.net', 'djib-poc.karl-fixto.net'],
		port: 3476
	}
    })
