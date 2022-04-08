const pkg = require('./package.json')

const { defineConfig } = require('@vue/cli-service')
const dynamicThemePlugin = require('./src/webpack/dynamicTheme.js')

module.exports = defineConfig({
  publicPath: process.env.PUBLIC_PATH,

  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].version = pkg.version
      return args
    })
  },

  configureWebpack: {
    plugins: [dynamicThemePlugin()]
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'border-radius-base': '2px'
        },
        javascriptEnabled: true
      }
    }
  },

  lintOnSave: false,
  transpileDependencies: [],
  productionSourceMap: false
})
