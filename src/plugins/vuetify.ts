import 'vuetify/styles'
import { createVuetify } from 'vuetify'
// import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
// import { mdiAccount } from '@mdi/js'

export default createVuetify({
  ssr: false,
})
