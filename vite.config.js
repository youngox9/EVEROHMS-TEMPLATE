import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vitePluginRequire from 'vite-plugin-require';
// import legacy from "@vitejs/plugin-legacy";
import path, { resolve } from 'path';

const env = process.env.NODE_ENV;
const isDev = env === 'development';

const VITE_DEFAULT_SETTING = {
  development: {
    build: {
      minify: false,
      sourcemap: true,
    },
  },
  production: {
    build: {
      chunkSizeWarningLimit: 4000,
      minify: true,
      sourcemap: false,
    },
  },
};

export default defineConfig({
  define: {},
  plugins: [
    vue(),
    vitePluginRequire(),
    // legacy({
    //   targets: ["defaults", "not IE 11"],
    // }),
  ],
  server: {
    //使用IP能访问
    host: '0.0.0.0',
  },
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      vue: path.resolve(
        __dirname,
        'node_modules/' + 'vue/dist/vue.runtime.esm-browser.js'
      ),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        implementation: require('sass'),
      },
    },
  },

  preview: {
    cors: true,
  },
  ...(VITE_DEFAULT_SETTING?.[env] || {}),
});
