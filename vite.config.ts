import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), react(), tsconfigPaths()],
  resolve: {
		alias: {
			src: path.resolve('src/'),
      assets: path.resolve('src/assets'),
      pages: path.resolve('src/pages'),
      components: path.resolve('src/components'),
      constants: path.resolve('src/constants'),
      config: path.resolve('src/config'),
      schemas: path.resolve('src/schemas'),
      hooks: path.resolve('src/hooks'),
      endpoints: path.resolve('src/endpoints'),
      utils: path.resolve('src/utils'),
      transformers: path.resolve('src/transformers')
    }
  }
})
