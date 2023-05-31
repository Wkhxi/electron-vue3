import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// 在 vue 页面中使用 Node.js 和 electron 的内置模块
// vite-plugin-optimizer 插件不仅用于开发环境，编译 Vue 项目时，它也会参与
import optimizer from "vite-plugin-optimizer"

import { devPlugin, getReplacer } from "./plugins/devPlugin"
import { buildPlugin } from "./plugins/buildPlugin"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [optimizer(getReplacer()), devPlugin(), vue(), vueJsx()],
  build: {
    rollupOptions: {
      plugins: [buildPlugin()],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5100
  }
})
