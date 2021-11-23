import { AdminApiClient, HaloRestAPIClient } from '@halo-dev/admin-api'
import store from '@/store'
import { isObject } from '@/utils/util'
import { message, notification } from 'ant-design-vue'

const apiUrl = process.env.VUE_APP_API_URL ? process.env.VUE_APP_API_URL : 'http://localhost:8080'

const haloRestApiClient = new HaloRestAPIClient({
  baseUrl: apiUrl
})

const apiClient = new AdminApiClient(haloRestApiClient)

haloRestApiClient.interceptors.request.use(
  async config => {
    const token = store.getters.token
    if (token && token.access_token) {
      config.headers['Admin-Authorization'] = token.access_token
    }

    // TODO ignore login and refresh token requests

    const expireTime = Date.now() + 1000 * token.expired_at
    if (Date.now() >= expireTime) {
      await store.dispatch('refreshToken', token.refresh_token)
      return config
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

function getFieldValidationError(data) {
  if (!isObject(data) || !isObject(data.data)) {
    return null
  }

  const errorDetail = data.data

  return Object.keys(errorDetail).map(key => errorDetail[key])
}

haloRestApiClient.interceptors.response.use(
  response => {
    return response
  },
  error => {
    const response = error.response
    const data = response ? response.data : null

    if (data) {
      if (data.status === 400) {
        const errorDetails = getFieldValidationError(data)
        notification.error({
          message: data.message,
          description: h => {
            const errorNodes = errorDetails.map(errorDetail => {
              return h('a-alert', {
                props: {
                  message: errorDetail,
                  banner: true,
                  showIcon: false,
                  type: 'error'
                }
              })
            })
            return h('div', errorNodes)
          },
          duration: 10
        })
      }
    } else {
      message.error('网络异常')
    }

    return Promise.reject(error)
  }
)

export default apiClient

export { haloRestApiClient }
