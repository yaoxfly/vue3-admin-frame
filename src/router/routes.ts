import Layout from '@/layout/index'
const routes = [
  {
    path: '/',
    name: 'home',
    component: Layout,
    redirect: '/demo',
    children: [
      {
        path: '/demo',
        name: 'demo',
        component: () => import('@/views/test/father'),
        meta: {
          breadcrumb: [
            {
              title: 'home',
              path: '/'
            },
            {
              title: 'demo'
            }
          ]
        }

      },
      // 如果是 404 只针对 /demo 的页面，放到 children 最后
      {
        path: ':pathMatch(.*)*',
        name: 'demo-404',
        component: () => import('@/views/404/index'),
        meta: {
          breadcrumb: [
            {
              title: '异常页面'

            },
            {
              title: '404'
            }
          ]
        }
      }
    ]
  },
  // 全局 404 页面，确保它是最后一个路由
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/404/index'),
    meta: {
      breadcrumb: [
        {
          title: '异常页面'

        },
        {
          title: '404'
        }
      ]
    }
  }
]
export default routes
