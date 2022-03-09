import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import { domTitle, setDocumentTitle } from '@/utils/domUtil'

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
  if (store.getters.isInstalled === undefined) {
    await store.dispatch('fetchIsInstalled')
  }

  if (!store.getters.isInstalled && to.name !== 'Install') {
    next({
      name: 'Install'
    })
    onProgressTimerDone()
    return
  }

  if (store.getters.isInstalled && to.name === 'Install') {
    next({
      name: 'Login'
    })
    onProgressTimerDone()
    return
  }

  if (store.getters.token) {
    if (!store.getters.options) {
      await store.dispatch('refreshOptionsCache').then()
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

  // Check whitelist
  if (whiteList.includes(to.name)) {
    next()
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
