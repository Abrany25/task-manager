import 'vuetify/styles/main.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
})

const customTheme = {
  dark: false,
  colors: {
    primary: '#4A148C',
    secondary: '#7C4DFF',
    background: '#f9f9f9',
    surface: '#ffffff',
    error: '#EF5350',
    success: '#66BB6A'
  }
}

export default vuetify; createVuetify({
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme
    }
  }
})
