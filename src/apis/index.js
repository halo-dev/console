import axios from 'axios'

import { DefaultAxiosClient, AuthApi } from '@hangar/api-client'

export const apiClient = new DefaultAxiosClient(axios.create())

export const authApi = new AuthApi(apiClient)
