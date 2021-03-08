<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px' }">
    <template #title>
      速记
    </template>
    <template #action>
      <a-tooltip title="内容将保存到页面/所有页面/日志页面">
        <a-icon type="info-circle-o" class="cursor-pointer" />
      </a-tooltip>
    </template>
    <a-form ref="journalForm" :model="form.model" :rules="form.rules" layout="vertical">
      <a-form-item prop="sourceContent">
        <a-input
          type="textarea"
          :autoSize="{ minRows: 8 }"
          v-model="form.model.sourceContent"
          placeholder="写点什么吧..."
        />
      </a-form-item>
      <a-form-item>
        <ReactiveButton
          @click="handleCreateJournalClick"
          @callback="
            () => {
              if (!form.errored) form.model = {}
              form.errored = false
            }
          "
          :loading="form.saving"
          :errored="form.errored"
          text="发布"
          loadedText="发布成功"
          erroredText="发布失败"
        ></ReactiveButton>
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script>
import journalApi from '@/api/journal'
export default {
  name: 'JournalPublishCard',
  data() {
    return {
      form: {
        model: {},
        rules: {
          sourceContent: [{ required: true, message: '* 内容不能为空', trigger: ['change'] }]
        },
        saving: false,
        errored: false
      }
    }
  },
  methods: {
    handleCreateJournalClick() {
      const _this = this
      _this.$refs.journalForm.validate(valid => {
        if (valid) {
          _this.form.saving = true
          journalApi
            .create(_this.form.model)
            .catch(() => {
              this.form.errored = true
            })
            .finally(() => {
              setTimeout(() => {
                _this.form.saving = false
              }, 400)
            })
        }
      })
    }
  }
}
</script>
