import { AdminApiClient, AxiosInstance, HaloRestAPIClient } from '@halo-dev/admin-api'
import store from '@/store'
import { message } from 'ant-design-vue'

const apiUrl = process.env.VUE_APP_API_URL ? process.env.VUE_APP_API_URL : 'http://localhost:8080'

const haloRestApiClient = new HaloRestAPIClient({
  baseUrl: apiUrl
})

const apiClient = new AdminApiClient(haloRestApiClient)

haloRestApiClient.interceptors.request.use(
  config => {
    const token = store.getters.token
    if (token && token.access_token) {
      config.headers['Admin-Authorization'] = token.access_token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

haloRestApiClient.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    const token = store.getters.token
    const originalRequest = error.config
    const response = error.response
    const data = response ? response.data : null

    if (data) {
      if (data.status === 400) {
        // TODO
      } else if (data.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        await store.dispatch('refreshToken', token.refresh_token)

        return AxiosInstance(originalRequest)
      }
    } else {
      message.error('网络异常')
    }

    return Promise.reject(error)
  }
)

export default apiClient

export { haloRestApiClient }
