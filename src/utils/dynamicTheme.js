// see https://github.com/vueComponent/pro-components/blob/v1.0.9/src/utils/dynamicTheme.js
// license: https://github.com/vueComponent/pro-components/blob/v1.0.9/LICENSE

import client from 'webpack-theme-color-replacer/client'
import generate from '@ant-design/colors/lib/generate'
import { message } from 'ant-design-vue'

export const themeColor = {
  getAntdSerials(color) {
    const lightens = new Array(9).fill().map((t, i) => {
      return client.varyColor.lighten(color, i / 10)
    })
    const colorPalettes = generate(color)
    const rgb = client.varyColor.toNum3(color.replace('#', '')).join(',')
    return lightens.concat(colorPalettes).concat(rgb)
  },
  changeColor(newColor) {
    const options = {
      newColors: this.getAntdSerials(newColor),
      changeUrl(cssUrl) {
        return `/${cssUrl}`
      }
    }
    return client.changer.changeColor(options, Promise)
  }
}

export const updateTheme = newPrimaryColor => {
  const hideMessage = message.loading('正在切换主题', 0)
  themeColor.changeColor(newPrimaryColor).then(() => {
    hideMessage()
  })
}
