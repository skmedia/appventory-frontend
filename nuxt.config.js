import path from 'path'
import fs from 'fs'

export default {
  server: {
    port: 3005,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'keys/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'keys/cert.pem'))
    }
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s',
    title: 'AppVento',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/axios',
    '@/plugins/api',
    '@/plugins/vuelidate',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/color-mode',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios'
  ],

  axios: {
    proxy: true
  },

  proxy: {
    '/api/': {
      target: 'https://localhost:3000',
      pathRewrite: { '^/api/': '' },
      secure: false
    }
  },

  auth: {
    strategies: {
      google: {
        clientId: '465685495534-066r84qdd867bnkvlu4suqf493q9e11i.apps.googleusercontent.com',
        scope: ['profile', 'email', 'openid'],
        codeChallengeMethod: '',
        responseType: 'code',
        endpoints: {
          token: '/api/user/google/', // somm backend url to resolve your auth with google and give you the token back
          userInfo: '/api/auth/user/' // the endpoint to get the user info after you recived the token
        },
      },
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
