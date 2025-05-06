import type { Router } from 'vue-router'

export const setupRouterGuard = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    // 可以添加登录验证、权限校验等
    next()
  })
}
