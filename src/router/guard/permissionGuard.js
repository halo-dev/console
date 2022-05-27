import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import { domTitle, setDocumentTitle } from '@/utils/domUtil'

import { asyncRouterMap } from '@/config/router.config'
import { message } from 'ant-design-vue'
import _ from 'lodash'

NProgress.configure({ showSpinner: false, speed: 500 })

const whiteList = ['Login', 'Install', 'NotFound', 'ResetPassword'] // no redirect whitelist

let progressTimer = null
router.beforeEach(async (to, from, next) => {
  onProgressTimerDone()

  progressTimer = setTimeout(() => {
    NProgress.start()
  }, 250)

  // set title meta
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`)

  // check installation status
  // if (store.getters.isInstalled === undefined) {
  //   await store.dispatch('fetchIsInstalled')
  // }

  // if (!store.getters.isInstalled && to.name !== 'Install') {
  //   next({
  //     name: 'Install'
  //   })
  //   onProgressTimerDone()
  //   return
  // }

  // if (store.getters.isInstalled && to.name === 'Install') {
  //   next({
  //     name: 'Login'
  //   })
  //   onProgressTimerDone()
  //   return
  // }

  // Check whitelist
  if (whiteList.includes(to.name)) {
    next()
    return
  }

  if (store.getters.token) {
    if (!store.getters.options) {
      await store.dispatch('refreshOptionsCache').then()
    }

    if (!store.getters.user) {
      store
        .dispatch('refreshUserCache')
        .then(result => {
          store.dispatch('refreshAsyncRouters', generateRoutes(asyncRouterMap, result.data.data.permissions))
          router.addRoutes(store.getters.asyncRouters)
        })
        .catch(err => {
          message.error('获取用户信息失败', err)
          next({ name: 'Login' })
          onProgressTimerDone()
          return
        })
    }

    if (['Login', 'Install'].includes(to.name)) {
      next({
        name: 'Dashboard'
      })
      onProgressTimerDone()
      return
    }

    next()
    onProgressTimerDone()
    return
  }

  next({
    name: 'Login',
    query: {
      redirect: to.fullPath
    }
  })
  onProgressTimerDone()
})

router.afterEach(() => {
  onProgressTimerDone()
})

function onProgressTimerDone() {
  if (progressTimer && progressTimer !== 0) {
    clearTimeout(progressTimer)
    progressTimer = null
    NProgress.done()
  }
}

function generateRoutes(routers, permissions) {
  const result = []
  routers.forEach(route => {
    const newRoute = _.cloneDeep(route)
    if (hasPermission(newRoute, permissions)) {
      result.push(newRoute)
      if (newRoute.children && newRoute.children.length) {
        newRoute.children = generateRoutes(newRoute.children, permissions)
      }
    }
  })
  return result
}

/**
 * 判断是否拥有路由权限
 *
 * @param route 路由实体
 * @param permissions 权限实体数组
 * @returns boolean 是否拥有权限 true 是, false 否
 */
function hasPermission(route, permissions) {
  let result = true
  if (route.meta && route.meta.permissions) {
    result = false
    for (const permission of permissions) {
      if (route.meta.permissions.includes(permission)) {
        result = true
        break
      }
    }
  }
  return result
}
