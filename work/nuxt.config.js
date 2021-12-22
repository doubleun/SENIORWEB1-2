import colors from "vuetify/es5/util/colors";

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - work",
    title: "work",
    htmlAttrs: {
      lang: "en"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/icon?family=Material+Icons"
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify"
  ],

  axios: {
    baseURL: "http://localhost:3000/api",
    credentials: true
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/axios"],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  router: {
    middleware: "authenticated"
  },
  serverMiddleware: [{ path: "/api", handler: "~/api/app.js" }],

  // // Auth
  // //! The commented out is an alternative, to use the backend redirect needs to be rewrote
  // auth: {
  //   redirect: {
  //     login: "/",
  //     logout: "/logout",
  //     home: "/",
  //     callback: false
  //   },
  //   strategies: {
  //     google: {
  //       clientId: process.env.GOOGLE_CLIENT_ID,
  //       // codeChallengeMethod: "",
  //       // responseType: "id_token token",
  //       // scope: ["profile", "email"],
  //       // resonseType: "code",
  //       // codeChallengeMethod: "S256", // Required because the default causes google to throw invalid request
  //       // responseType: "code", // Required because the default 'token' includes rejected nonce arg
  //       // accessType: "offline", // Required to ensure we get a long lived refresh token
  //       // grantType: "authorization_code",
  //       // endpoints: {
  //       // token: "http://localhost:3000/api/auth/google",
  //       // }
  //       redirectUri: "http://localhost:3000/senior"
  //     }
  //   }
  // },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    watch: ["api"]
  }
};
