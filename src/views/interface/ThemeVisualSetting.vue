<template>
  <a-row :gutter="0">
    <a-col :md="6" :sm="24" class="h-screen" style="border-right: 1px solid #f2f2f2">
      <a-spin :spinning="theme.loading" class="h-full">
        <ThemeSettingForm :theme="theme.data" :wrapperCol="{ span: 24 }" @saved="onSettingsSaved" />
      </a-spin>
    </a-col>
    <a-col :md="18" :sm="24" class="h-screen">
      <iframe
        id="themeViewIframe"
        :src="options.blog_url"
        frameborder="0"
        height="100%"
        scrolling="auto"
        width="100%"
      />
    </a-col>
  </a-row>
</template>
<script>
// components
import ThemeSettingForm from './components/ThemeSettingForm'

import apiClient from '@/utils/api-client'
import { mapGetters } from 'vuex'

export default {
  name: 'ThemeVisualSetting',
  components: {
    ThemeSettingForm
  },
  data() {
    return {
      theme: {
        data: {},
        loading: false
      }
    }
  },
  computed: {
    ...mapGetters(['options'])
  },
  beforeRouteEnter(to, from, next) {
    // Get theme id from query
    const themeId = to.query.themeId
    next(async vm => {
      await vm.handleGetTheme(themeId)
    })
  },
  methods: {
    async handleGetTheme(themeId) {
      try {
        this.theme.loading = true
        const { data } = await apiClient.theme.get(themeId)
        this.theme.data = data
      } finally {
        this.theme.loading = false
      }
    },
    onSettingsSaved() {
      document.getElementById('themeViewIframe').contentWindow.location.reload()
    }
  }
}
</script>
<style scoped>
::v-deep .ant-spin-container {
  height: 100%;
}

::v-deep .ant-tabs-content {
  height: 100%;
  overflow: auto;
  padding-bottom: 20px;
}
</style>
