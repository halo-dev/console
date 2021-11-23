import { AdminApiClient, HaloRestAPIClient, AuthorizedClient } from '@halo-dev/admin-api'
import './axios-interceptors'
import store from '@/store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'

const apiUrl = process.env.VUE_APP_API_URL ? process.env.VUE_APP_API_URL : 'http://localhost:8080'
const haloRestApiClient = new HaloRestAPIClient({
  baseUrl: apiUrl
})
const apiClient = new AdminApiClient(haloRestApiClient)
const authorizatedClient = new AuthorizedClient(apiUrl)

haloRestApiClient.interceptors.request.use(
  config => {
    const storedToken = Vue.ls.get(ACCESS_TOKEN)
    if (storedToken) {
      config.headers['Admin-Authorization'] = storedToken.access_token
    }
    return config
  },
  () => {
    const storedToken = Vue.ls.get(ACCESS_TOKEN)
    const expireTime = Date.now() + 1000 * storedToken.expired_at
    if (Date.now() > expireTime) {
      Vue.$log.warning(`Token has expired at ${storedToken.expired_at}, ready to refresh token.`)
      // token过期
      store
        .dispatch('refreshToken', storedToken.refresh_token)
        .then(() => {})
        .catch(() => {
          window.location.reload()
        })
    }
  }
)

export default apiClient
export { haloRestApiClient, authorizatedClient }
