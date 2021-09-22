// © Microsoft Corporation. All rights reserved.

module.exports = {
  mode: 'jit',
  purge: [
    './microsoft-news/!(assets)/**/*.{php,jsx}',
    './microsoft-news/assets/**/*.js'
  ],
  corePlugins: {
    preflight: false
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend:{
      colors:{
        microsoft: '#0078d4',
      },
    },
    container: {
      center: true,
      screens: {
         sm: "100%",
         md: { maxWidth: "100%", margin: "10px" },
         lg: "1066px",
         xl: "1066px"
      }
    }
  },
  variants: {
    extend: {}
  },
}
