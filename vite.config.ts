import { defineConfig, loadEnv, UserConfigExport, ConfigEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import eslintPlugin from 'vite-plugin-eslint'
import { createHtmlPlugin } from 'vite-plugin-html'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer' // 性能分析，打开stats.html，查看打包情况
import legacy from '@vitejs/plugin-legacy'
import AutoImport from 'unplugin-auto-import/vite'
import postcssImport from 'postcss-import'
import autoprefixer from 'autoprefixer'
import browserslist from 'browserslist' // 统一js/css兼容性
import checker from 'vite-plugin-checker'
import externalGlobals from 'rollup-plugin-external-globals'
const browserslistConfig = browserslist.loadConfig({ path: '.' }) // npx browserslist "> 0.02%, last 2 versions,Firefox ESR,not dead" 查询兼容的浏览器
const externalGlobalsConfig = {
  vue: 'Vue',
  axios: 'axios',
  'vue-demi': 'VueDemi', // 用了pinia必须配置
  'vue-router': 'VueRouter',
  qs: 'Qs',
  pinia: 'Pinia',
  '@vueuse/core': 'VueUse' // 打包后谷歌83以上可行,不用cdn或者用cdn不用min版本63可行
}

const cdn = {
  css: [],
  js: [
    {
      // vue
      url: 'https://fastly.jsdelivr.net/npm/vue@3.3.13/dist/vue.global.prod.js',
      rel: 'preload' // preload | prefetch
    },
    {
      // vue-demi pinia 前置插件
      url: 'https://fastly.jsdelivr.net/npm/vue-demi@0.13.11/lib/index.iife.min.js',
      rel: 'preload'
    },
    {
      // pinia
      url: 'https://fastly.jsdelivr.net/npm/pinia@2.1.7/dist/pinia.iife.prod.js',
      rel: 'preload'
    },
    {
      // vue-router
      url: 'https://fastly.jsdelivr.net/npm/vue-router@4.4.0/dist/vue-router.global.prod.js',
      rel: 'preload'
    },
    {
      // axios
      url: 'https://fastly.jsdelivr.net/npm/axios@1.7.2/dist/axios.min.js',
      rel: 'preload'
    },
    {
      // qs
      url: 'https://fastly.jsdelivr.net/npm/qs@6.12.3/dist/qs.min.js',
      rel: 'preload'
    },
    {
      // shared  vueuse/core 前置插件
      url: 'https://fastly.jsdelivr.net/npm/@vueuse/shared@10.11.0/index.iife.js',
      rel: 'preload'
    },
    {
      // @vueuse/core
      url: 'https://fastly.jsdelivr.net/npm/@vueuse/core@10.11.0/index.iife.js',
      rel: 'preload'
    }
  ]
}

export default ({ mode }: ConfigEnv): UserConfigExport => defineConfig({
  // 部署在二级目录下，也需要加个二级目录
  base: loadEnv(mode, process.cwd()).VITE_APP_PUBLIC_PATH,
  plugins: [
    vue(),
    createHtmlPlugin({
      minify: true,
      entry: 'src/main.ts',
      // template: 'public/index.html',
      inject: {
        data: {
          title: 'Vue App',
          //  出现souceMap找不情况，需换链接, 如果是把资源文件放在自己的库中，需下载对应的map文件。
          cdn: {
            css: loadEnv(mode, process.cwd()).VITE_APP_CURRENT_MODE !== 'development' ? cdn.css : [],
            js: loadEnv(mode, process.cwd()).VITE_APP_CURRENT_MODE !== 'development' ? cdn.js : []
          }
        }
      }
    }),
    vueJsx(),
    eslintPlugin({
      exclude: ['./node\_modules/**', './dist'],
      cache: false
    }),
    compression(),
    visualizer(),
    legacy({
      targets: browserslistConfig,
      additionalLegacyPolyfills: [
        'regenerator-runtime/runtime',
        'core-js/modules/es.array.flat-map.js', // Chrome 63 的刚需
        'core-js/modules/es.object.values.js', //  51-53 版本的刚需
        'core-js/modules/es.promise.finally.js' // 许多 UI 库会用到
      ],
      // 关键：现代模式补丁（针对那些支持 ESM 但 API 不全的浏览器，如 Chrome 63）
      modernPolyfills: [
        'es.array.flat-map',
        'es.object.values'
      ],
      polyfills: true
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/, /\.vue\?vue/, // .vue
        /\.md$/ // .md
      ],
      imports: [
        'vue',
        {
          'vue-router': [
            'useLink',
            'useRoute',
            'useRouter',
            'onBeforeRouteLeave',
            'onBeforeRouteUpdate',
            'createRouter',
            'createWebHistory'
          ]
        },
        {
          '@vueuse/core': [
            'useStorage'
          ]
        }
      ],
      dts: 'src/auto-import.d.ts',
      vueTemplate: false,
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true
      }
    }),
    viteMockServe({
      // default
      mockPath: 'src/mock',
      watchFiles: true,
      enable: loadEnv(mode, process.cwd()).VITE_APP_CURRENT_MODE === 'development'
    }),
    checker({
      typescript: true // 检查ts类型
    }),
    {
      ...externalGlobals(externalGlobalsConfig),
      enforce: 'post',
      apply: 'build'
    }
  ],
  // optimizeDeps: {
  //   // 开发中预先打包，加速这些依赖项的加载和解析，提升开发体验
  //   include: Object.keys(externalGlobalsConfig)
  // },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        // 去除 @charset utf-8警告
        charset: false
      }
    },
    postcss: {
      plugins: [
        postcssImport,
        autoprefixer
      ]
    }
  },
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  server: {
    // 指定服务网络,不然只会显示本地的
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: '127.0.0.1',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    cssTarget: 'es2015',
    // cssMinify: false, //打包不会压缩 CSS，会保留原始结构，可查看css打包异常
    outDir: './dist/',
    sourcemap: false,
    cssCodeSplit: true, // 开发环境和测试环境样式不一致可尝试设置false，紧急上线时用
    minify: 'terser',
    terserOptions: {
      safari10: true, // 解决一些旧版 WebKit 引擎的 Bug
      compress: {
        drop_console: loadEnv(mode, process.cwd()).VITE_APP_CURRENT_MODE === 'production',
        drop_debugger: loadEnv(mode, process.cwd()).VITE_APP_CURRENT_MODE === 'production',
        // 防止 Terser 转换出一些过于超前的压缩代码
        ecma: 5,
        arrows: false // 额外保护：禁止将普通函数压缩回箭头函数
      },
      output: {
        // 强制输出 ES5 级别的代码
        ecma: 5,
        ascii_only: true // 解决老浏览器对特殊字符编码解析出错的问题
      }
    },
    chunkSizeWarningLimit: 2000, // chunks 大小限制
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        manualChunks: id => {
          if (id.includes('node_modules')) { // 超大静态资源拆分
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      },
      external: Object.keys(externalGlobalsConfig)
    }
  }
})
