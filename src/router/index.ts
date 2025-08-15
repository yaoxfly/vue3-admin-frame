import routes from './routes'
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
export * from './lib/dynamicRoutes'
export * from './lib/generateRoutesFromMenu'
export * from './lib/generateNonMenuRoutes'
export * from './lib/routerGuard'
