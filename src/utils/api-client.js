import { AdminApiClient, DefaultTokenProvider, HaloRestAPIClient, LocalStorageTokenStore } from '@halo-dev/admin-api'
import encrypt from '@/utils/encrypt'

const localStorageCredentials = encrypt.decrypt(localStorage.getItem('UserCredentials'))

const localStorageTokenStore = new LocalStorageTokenStore()

const haloRestApiClient = new HaloRestAPIClient({
  baseUrl: 'http://localhost:8090'
})

const buildTokenProvider = credentials => {
  return new DefaultTokenProvider(credentials, 'http://localhost:8090', localStorageTokenStore)
}

if (localStorageCredentials) {
  const tokenProvider = buildTokenProvider(localStorageTokenStore)
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
