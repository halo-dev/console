import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRouterMap, asyncRouterMap } from '@/config/router.config'

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes: constantRouterMap.concat(asyncRouterMap)
})

export function setupRouter(app) {
  app.use(router)
}

export default router
