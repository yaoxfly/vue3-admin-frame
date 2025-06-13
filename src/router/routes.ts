import Layout from '@/layout/index'
const routes = [
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/home',
    children: [
      // ——— 通用重定向占位路由 ———
      {
        path: '/redirect/:pathMatch(.*)*',
        // 直接渲染空组件
        component: { render: () => null }
      },
      {
        path: '/detail',
        name: 'Detail',
        component: () => import('@/views/detail/index'),
        meta: {
          title: '详情页面',
          breadcrumb: [
            { title: '详情页面', path: '/detail' }
          ]
        }
      }
    ]
  }

]
export default routes
