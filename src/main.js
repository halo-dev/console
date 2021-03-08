import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/'
import store from '@/store/'

import { setupLogger } from '@/plugins/logger'

import '@/styles/tailwind.css'
import './core/lazy_use'
import '@/router/guard/'
import '@/filters/filter' // global filter
import './components'
import { version } from '../package.json'

const app = createApp(App)
app.use(store)
app.use(router)
app.provide('app_version', version)

// register plugins
setupLogger(app)

app.mount('#app')
