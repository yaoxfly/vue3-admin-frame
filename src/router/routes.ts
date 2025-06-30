/**
 * @description 路由配置
 */
import Layout from '@/layout/index'
const routes = [
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/home',
    children: [
      // ——— 通用重定向占位路由  在标签页组件中，当用户点击"重新加载"时触发———
      {
        path: '/redirect/:pathMatch(.*)*',
        // 直接渲染空组件
        component: { render: () => null }
      }
    ]
  }
]
export default routes
