import Vue from 'vue'
import config from '@/config/defaultSettings'

// base library
import '@/core/lazy_lib/components_use'
import 'ant-design-vue/dist/antd.less'
import bootstrap from './bootstrap'

import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

bootstrap()
