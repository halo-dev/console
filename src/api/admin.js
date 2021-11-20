import service from '@/utils/service'

const baseUrl = '/api/admin'

const adminApi = {}

adminApi.login = (username, password, authcode) => {
  return service({
    url: `${baseUrl}/login`,
    data: {
      username: username,
      password: password,
      authcode: authcode
    },
    method: 'post'
  })
}

adminApi.refreshToken = refreshToken => {
  return service({
    url: `${baseUrl}/refresh/${refreshToken}`,
    method: 'post'
  })
}

export default adminApi
