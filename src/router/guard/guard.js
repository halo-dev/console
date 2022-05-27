import NProgress from 'nprogress'
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'
import store from '@/store'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import notification from 'ant-design-vue/es/notification'
import { isAuthorizationCode, authorize } from '@/apis/auth'
import { get, isNil } from 'lodash'

const WHITE_LIST = [
  'Login',
  'Install',
  'NotFound',
  'ResetPassword',
  'AuthorizationLogin',
  'authorizationCode',
  'register',
  'registerResult'
]
const loginRoutePath = '/login'
const defaultRoutePath = '/'

/**
 *  动态路由
 * @param {object} router 路由
 * @param {object} from 来源路由
 * @param {object} to 访问路由
 * @param {function} next 跳转函数
 */
const dynamicRoutes = (router, from, to, next) => {
  store
    .dispatch('GetInfo')
    .then(res => {
      store.dispatch('GenerateRoutes', res && res.permissions).then(() => {
        router.addRoutes(store.getters.addRouters)
      })
      const redirect = decodeURIComponent(from.query.redirect || to.path)
      if (to.path === redirect) {
        next({ ...to, replace: true })
      } else {
        next({ path: redirect })
      }
    })
    .catch(err => {
      notification.error({
        message: '错误',
        description: err
      })
      store.dispatch('Logout').then(() => {
        next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      })
    })
}

/**
 * 是否未登录
 * @returns 结构
 */
const isNotLogin = () => {
  return isNil(storage.get(ACCESS_TOKEN))
}

/**
 * 是否未没权限
 * @returns 结构
 */
const isNoPermissions = () => {
  return store.getters.roles.length === 0
}

/**
 * 是否白名单路由
 * @param {string} routeName 路由名称
 * @returns 结果
 */
const isWhiteList = routeName => {
  return WHITE_LIST.includes(routeName)
}

/**
 * 跳转到登录路由
 * @param {object} to 访问路由
 * @param {function} next 跳转函数
 */
const loginRoute = (to, next) => {
  if (isAuthorizationCode()) {
    const clientAuthorizeCode = get(to, 'query.code')
    if (clientAuthorizeCode) {
      next({ path: '/login/authorization-code', query: { code: clientAuthorizeCode } })
    } else {
      storage.set('authorizationCodeRedirectUrl', to.fullPath)
      authorize()
    }
  } else {
    next({ path: loginRoutePath, query: { redirect: to.fullPath } })
  }
}

/**
 * 路由守卫
 * @param {object} router 路由
 */
const guard = router => {
  NProgress.configure({ showSpinner: false })
  router.beforeEach((to, from, next) => {
    NProgress.start()
    to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`)
    if (isWhiteList(to.name)) {
      next()
      return
    }
    if (isNotLogin()) {
      loginRoute(to, next)
      return
    }
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      return
    }
    ;(isNoPermissions() && dynamicRoutes(router, from, to, next)) || next()
  })

  router.afterEach(() => {
    NProgress.done()
  })
}

export default guard
