import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import apiClient, { haloRestApiClient } from '@/utils/api-client'

NProgress.configure({ showSpinner: false, speed: 500 })

const whiteList = ['Login', 'Install', 'NotFound', 'ResetPassword'] // no redirect whitelist

let progressTimer = null
router.beforeEach(async (to, from, next) => {
  onProgressTimerDone()
  progressTimer = setTimeout(() => {
    NProgress.start()
  }, 250)
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`)
  const tokenProvider = haloRestApiClient.getTokenProvider()
  Vue.$log.debug('Token', tokenProvider)
  if (tokenProvider) {
    if (to.name === 'Install') {
      next()
      return
    }
    const response = await apiClient.isInstalled()
    if (!response.data) {
      next({
        name: 'Install'
      })
      onProgressTimerDone()
      return
    }
    if (to.name === 'Login') {
      next({
        name: 'Dashboard'
      })
      onProgressTimerDone()
      return
    }

    if (!store.getters.options) {
      store.dispatch('refreshOptionsCache').then()
    }
    next()
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
