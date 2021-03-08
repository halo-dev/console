import { createStore } from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import option from './modules/option'
import getters from './getters'

export default createStore({
  modules: {
    app,
    user,
    permission,
    option
  },
  state: {},
  mutations: {},
  actions: {},
  getters
})
