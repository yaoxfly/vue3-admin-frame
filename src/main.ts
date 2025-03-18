import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import '@/assets/style/index.css'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
createApp(App)
  .use(router)
  .use(ElementPlus)
  .use(createPinia())
  .mount('#app')
