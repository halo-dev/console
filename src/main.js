import { createApp } from 'vue'
import App from './App.vue'

import { setupRouter } from '@/router/'
import { setupStore } from '@/store/'

// ui
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import '@/styles/tailwind.css'

import bootstrap from '@/core/bootstrap'
bootstrap()

import '@/router/guard/'
// import '@/filters/filter'
import { registerComponents } from './components'
import { version } from '../package.json'

const app = createApp(App)

app.use(Antd)

setupRouter(app)
setupStore(app)
registerComponents(app)
app.provide('app_version', version)

app.mount('#app')
