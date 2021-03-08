import store from '@/store/'
import { getLocalStorage } from '@/utils/localStorage'
import {
  ACCESS_TOKEN,
  DEFAULT_COLOR,
  DEFAULT_THEME,
  DEFAULT_LAYOUT_MODE,
  SIDEBAR_TYPE,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_FIXED_SIDEMENU,
  DEFAULT_CONTENT_WIDTH_TYPE,
  USER,
  API_URL,
  OPTIONS
} from '@/store/mutation-types'
import config from '@/config/defaultSettings'

export default function Initializer() {
  store.commit('SET_SIDEBAR_TYPE', getLocalStorage(SIDEBAR_TYPE, true))
  store.commit('TOGGLE_THEME', getLocalStorage(DEFAULT_THEME, config.navTheme))
  store.commit('TOGGLE_LAYOUT_MODE', getLocalStorage(DEFAULT_LAYOUT_MODE, config.layout))
  store.commit('TOGGLE_FIXED_HEADER', getLocalStorage(DEFAULT_FIXED_HEADER, config.fixedHeader))
  store.commit('TOGGLE_FIXED_SIDERBAR', getLocalStorage(DEFAULT_FIXED_SIDEMENU, config.fixSiderbar))
  store.commit('TOGGLE_CONTENT_WIDTH', getLocalStorage(DEFAULT_CONTENT_WIDTH_TYPE, config.contentWidth))
  store.commit('TOGGLE_FIXED_HEADER_HIDDEN', getLocalStorage(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader))
  store.commit('TOGGLE_COLOR', getLocalStorage(DEFAULT_COLOR, config.primaryColor))
  store.commit('SET_TOKEN', getLocalStorage(ACCESS_TOKEN))
  store.commit('SET_USER', getLocalStorage(USER))
  store.commit('SET_API_URL', getLocalStorage(API_URL))
  store.commit('SET_OPTIONS', getLocalStorage(OPTIONS))
}
