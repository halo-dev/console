import Vue from 'vue'
import store from '@/store/'
import {
  ACCESS_TOKEN,
  DEFAULT_COLOR,
  DEFAULT_CONTENT_WIDTH_TYPE,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_FIXED_SIDEBAR,
  DEFAULT_LAYOUT_MODE,
  DEFAULT_THEME,
  OPTIONS,
  SIDEBAR_TYPE,
  USER
} from '@/store/mutation-types'
import config from '@/config/defaultSettings'

export default function Initializer() {
  store.commit('SET_SIDEBAR_TYPE', Vue.ls.get(SIDEBAR_TYPE, true))
  store.commit('TOGGLE_THEME', Vue.ls.get(DEFAULT_THEME, config.navTheme))
  store.commit('TOGGLE_LAYOUT_MODE', Vue.ls.get(DEFAULT_LAYOUT_MODE, config.layout))
  store.commit('TOGGLE_FIXED_HEADER', Vue.ls.get(DEFAULT_FIXED_HEADER, config.fixedHeader))
  store.commit('TOGGLE_FIXED_SIDEBAR', Vue.ls.get(DEFAULT_FIXED_SIDEBAR, config.fixedSidebar))
  store.commit('TOGGLE_CONTENT_WIDTH', Vue.ls.get(DEFAULT_CONTENT_WIDTH_TYPE, config.contentWidth))
  store.commit('TOGGLE_FIXED_HEADER_HIDDEN', Vue.ls.get(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader))
  store.commit('TOGGLE_COLOR', Vue.ls.get(DEFAULT_COLOR, config.primaryColor))
  store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
  store.commit('SET_USER', Vue.ls.get(USER))
  store.commit('SET_OPTIONS', Vue.ls.get(OPTIONS))
  // last step
}
