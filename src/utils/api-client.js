import { AdminApiClient, HaloRestAPIClient } from '@halo-dev/admin-api'

const haloRestApiClient = new HaloRestAPIClient({
  baseUrl: 'http://localhost:8090',
  auth: { adminToken: 'halo admin token' }
})
const apiClient = new AdminApiClient(haloRestApiClient)

export default apiClient
