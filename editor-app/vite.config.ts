import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '.', '')

	return {
		plugins: [
			react(),
			tailwindcss(),
			tsconfigPaths(),
			svgr({
				svgrOptions: {
					exportType: 'named',
					namedExport: 'ReactComponent'
				}
			})
		],
		optimizeDeps: {
			include: ['@craftjs/core']
		},
		resolve: {
			dedupe: ['react', 'react-dom']
		},
		server: {
			host: '0.0.0.0',
			port: 5173,
			proxy: {
				'/api': {
					target: env.VITE_API_BASE_URL || 'http://localhost:4200',
					changeOrigin: true,
					secure: false
				}
			}
		}
	}
})
