import Layout from '@/layout/index'
const routes = [
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/home',
    children: []
  }

]
export default routes
