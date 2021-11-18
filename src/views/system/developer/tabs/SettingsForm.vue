<template>
  <a-form :wrapperCol="wrapperCol" layout="vertical">
    <a-form-item label="开发者选项：">
      <a-switch v-model="options.developer_mode" />
    </a-form-item>
    <a-form-item>
      <ReactiveButton
        :errored="errored"
        :loading="saving"
        erroredText="保存失败"
        loadedText="保存成功"
        text="保存"
        type="primary"
        @callback="errored = false"
        @click="handleSaveOptions"
      ></ReactiveButton>
    </a-form-item>
  </a-form>
</template>
<script>
import { mapActions } from 'vuex'
import apiClient from '@/utils/api-client'

export default {
  name: 'SettingsForm',
  data() {
    return {
      options: [],
      wrapperCol: {
        xl: { span: 8 },
        lg: { span: 8 },
        sm: { span: 12 },
        xs: { span: 24 }
      },
      saving: false,
      errored: false
    }
  },
  created() {
    this.handleListOptions()
  },
  methods: {
    ...mapActions(['refreshOptionsCache']),
    handleListOptions() {
      apiClient.option.list().then(response => {
        this.options = response.data
      })
    },
    handleSaveOptions() {
      this.saving = true
      apiClient.option
        .save(this.options)
        .catch(() => {
          this.errored = false
        })
        .finally(() => {
          setTimeout(() => {
            this.saving = false
          }, 400)
          this.handleListOptions()
          this.refreshOptionsCache()
          if (!this.options.developer_mode) {
            this.$router.push({ name: 'ToolList' })
          }
        })
    }
  }
}
</script>
