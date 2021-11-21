import { AdminApiClient, DefaultTokenProvider, HaloRestAPIClient, LocalStorageTokenStore } from '@halo-dev/admin-api'
import encrypt from '@/utils/encrypt'
import './axios-interceptors'

const localStorageCredentials = encrypt.decrypt(localStorage.getItem('UserCredentials'))

const localStorageTokenStore = new LocalStorageTokenStore()

const apiUrl = process.env.VUE_APP_API_URL ? process.env.VUE_APP_API_URL : 'http://localhost:8080'

const haloRestApiClient = new HaloRestAPIClient({
  baseUrl: apiUrl
})

const buildTokenProvider = credentials => {
  return new DefaultTokenProvider(credentials, apiUrl, localStorageTokenStore)
}

if (localStorageCredentials) {
  const tokenProvider = buildTokenProvider(localStorageCredentials)
  haloRestApiClient.setTokenProvider(tokenProvider)
}

const apiClient = new AdminApiClient(haloRestApiClient)

const doAuthorize = credentials => {
  const encodedCredentials = encrypt.encrypt({ ...credentials })

  localStorage.setItem('UserCredentials', encodedCredentials)
  const tokenProvider = buildTokenProvider(credentials)
  haloRestApiClient.setTokenProvider(tokenProvider)
  return tokenProvider.getToken()
}

export default apiClient

export { haloRestApiClient, doAuthorize, localStorageTokenStore }
