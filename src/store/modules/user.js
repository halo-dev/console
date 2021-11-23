import Vue from 'vue'
import { ACCESS_TOKEN, USER } from '@/store/mutation-types'
import apiClient from '@/utils/api-client'

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
      state.token = null
    },
    SET_USER: (state, user) => {
      Vue.ls.set(USER, user)
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
        apiClient.user
          .getProfile()
          .then(response => {
            commit('SET_USER', response.data)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    refreshToken({ commit }, refreshToken) {
      return new Promise((resolve, reject) => {
        apiClient
          .refreshToken(refreshToken)
          .then(response => {
            const token = response.data.data
            Vue.$log.debug('Got token', token)
            commit('SET_TOKEN', token)

            resolve(response)
          })
          .catch(error => {
            const data = error.response.data
            Vue.$log.debug('Refresh error data', data)
            if (/登录状态已失效，请重新登录/.test(error.message)) {
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
