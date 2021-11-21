import { AdminApiClient, DefaultTokenProvider, HaloRestAPIClient, LocalStorageTokenStore } from '@halo-dev/admin-api'
import encrypt from '@/utils/encrypt'
import './axios-interceptors'

const apiUrl = process.env.VUE_APP_API_URL ? process.env.VUE_APP_API_URL : 'http://localhost:8080'

const buildTokenProvider = credentials => {
  return new DefaultTokenProvider(credentials, apiUrl, new LocalStorageTokenStore())
}

const haloRestApiClient = new HaloRestAPIClient({
  baseUrl: apiUrl,
  tokenProvider: (function() {
    const localStorageCredentials = encrypt.decrypt(localStorage.getItem('UserCredentials'))
    if (localStorageCredentials) {
      const tokenProvider = buildTokenProvider(localStorageCredentials)
      return tokenProvider
    }
    return null
  })()
})

const doAuthorize = credentials => {
  const encodedCredentials = encrypt.encrypt({ ...credentials })

  localStorage.setItem('UserCredentials', encodedCredentials)
  const tokenProvider = buildTokenProvider(credentials)
  haloRestApiClient.setTokenProvider(tokenProvider)
  return tokenProvider.getToken()
}

export default new AdminApiClient(haloRestApiClient)

export { haloRestApiClient, doAuthorize }
