import {
  AdminApiClient,
  DefaultTokenProvider,
  HaloRestAPIClient,
  LocalStorageTokenStore,
  AuthorizedClient
} from '@halo-dev/admin-api'
import encrypt from '@/utils/encrypt'
import './axios-interceptors'

const CREDENTIALS_KEY = 'UserCredentials'

const apiUrl = process.env.VUE_APP_API_URL ? process.env.VUE_APP_API_URL : 'http://localhost:8080'

class HaloSdkHelper {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.authorizatedClient = new AuthorizedClient(baseUrl)
    this.tokenProvider = this.createTokenProvider()
    this.haloRestApiClient = new HaloRestAPIClient({
      baseUrl: baseUrl,
      tokenProvider: this.tokenProvider
    })
    this.apiClient = new AdminApiClient(this.haloRestApiClient)
  }

  buildTokenProvider(credentials) {
    return new DefaultTokenProvider(credentials, this.baseUrl, new LocalStorageTokenStore())
  }

  doAuthorize(credentials) {
    this.setCredentials(credentials)
    this.tokenProvider = this.buildTokenProvider(credentials)
    this.haloRestApiClient.setTokenProvider(this.tokenProvider)
    return this.tokenProvider.getToken()
  }

  createTokenProvider() {
    const localStorageCredentials = this.getDecryptedCredentials()
    if (localStorageCredentials) {
      const tokenProvider = this.buildTokenProvider(localStorageCredentials)
      return tokenProvider
    }
    return null
  }

  getDecryptedCredentials() {
    return encrypt.decrypt(localStorage.getItem(CREDENTIALS_KEY))
  }

  setCredentials(credentials) {
    const encodedCredentials = encrypt.encrypt({ ...credentials })
    localStorage.setItem(CREDENTIALS_KEY, encodedCredentials)
  }

  useAuthRequestInterceptor(resolve, reject) {
    if (!this.tokenProvider) {
      return
    }
    this.tokenProvider.useAuthenticateRequestInterceptor(resolve, reject)
  }
}

const haloSdk = new HaloSdkHelper(apiUrl)

haloSdk.useAuthRequestInterceptor(async credentials => {
  // 校验NFA
  // const { data } = haloSdk.authorizatedClient.needMFACode(credentials)
  // console.log(data)
  return credentials
})

export default haloSdk.apiClient
export const haloRestApiClient = haloSdk.haloRestApiClient
export const doAuthorize = haloSdk.doAuthorize
