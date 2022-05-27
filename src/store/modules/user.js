import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import apiClient from '@/utils/api-client'
import { apiClient as hangarApiClient, authApi } from '@/apis'
import storage from 'store'

const user = {
  state: {
    token: null,
    user: {}
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      Vue.ls.set(ACCESS_TOKEN, token, token ? token.expired_in * 1000 : null)
      state.token = token
    },
    CLEAR_TOKEN: state => {
      Vue.ls.remove(ACCESS_TOKEN)
      storage.remove(ACCESS_TOKEN)
      state.token = null
    },
    SET_USER: (state, user) => {
      // Vue.ls.set(USER, user)
      state.user = user
    }
  },
  actions: {
    installCleanToken({ commit }, installData) {
      return new Promise((resolve, reject) => {
        apiClient.installation
          .install(installData)
          .then(response => {
            commit('CLEAR_TOKEN')
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    refreshUserCache({ commit }) {
      return new Promise((resolve, reject) => {
        hangarApiClient
          .get('/api/admin/user-info')
          .then(result => {
            commit('SET_USER', result.data.data)
            resolve(result)
          })
          .catch(err => {
            reject(err)
          })
        // apiClient.user
        //   .getProfile()
        //   .then(response => {
        //     commit('SET_USER', response.data)
        //     resolve(response)
        //   })
        //   .catch(error => {
        //     reject(error)
        //   })
      })
    },
    login({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        authApi
          .loginByUsername(username, password, 'halo-admin', '123456')
          .then(result => {
            storage.set(ACCESS_TOKEN, result.data.access_token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.data.access_token)
            resolve(result)
          })
          .catch(err => {
            reject(err)
          })
        // apiClient
        //   .login({ username, password, authcode })
        //   .then(response => {
        //     const token = response.data
        //     Vue.$log.debug('Got token', token)
        //     commit('SET_TOKEN', token)

        //     resolve(response)
        //   })
        //   .catch(error => {
        //     reject(error)
        //   })
      })
    },
    logout({ commit }) {
      return new Promise(resolve => {
        commit('CLEAR_TOKEN')
        commit('SET_USER', {})
        resolve()
      })
    },
    refreshToken({ commit }, refreshToken) {
      return new Promise((resolve, reject) => {
        apiClient
          .refreshToken(refreshToken)
          .then(response => {
            const token = response.data
            Vue.$log.debug('Got token', token)
            commit('SET_TOKEN', token)

            resolve(response)
          })
          .catch(error => {
            const data = error.data
            Vue.$log.debug('Refresh error data', data)
            if (data && data.status === 400 && data.data === refreshToken) {
              // The refresh token expired
              commit('CLEAR_TOKEN')
            }
            reject(error)
          })
      })
    }
  }
}

export default user
