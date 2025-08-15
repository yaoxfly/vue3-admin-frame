import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import '@/assets/style/index.scss'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import { router, routerGuard, dynamicRoutes } from '@/router'

async function bootstrap () {
  const app = createApp(App)
  app.use(createPinia())
  // 加载动态路由（确保 layout 子路由已注册）
  await dynamicRoutes(router)
  // 注册路由守卫（如权限判断）
  routerGuard(router)
  app.use(router)
  app.use(ElementPlus)
  app.mount('#app')
}
bootstrap()
