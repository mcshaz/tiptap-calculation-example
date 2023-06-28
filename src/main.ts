import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vuetify from './plugins/vuetify'

const appInstance = createApp(App)
appInstance.use(vuetify)
appInstance.mount('#app')
