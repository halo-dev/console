<template>
  <a-modal :visible="form.visible" :title="title" :closable="false" :maskClosable="false">
    <a-form-model ref="linkForm" :model="form.model" :rules="rules" layout="horizontal">
      <a-form-model-item label="网站名称：" prop="name">
        <a-input v-model="form.model.name" />
      </a-form-model-item>
      <a-form-model-item help="* 需要加上 http://" label="网站地址：" prop="url">
        <a-input v-model="form.model.url" />
      </a-form-model-item>
      <a-form-model-item label="Logo：" prop="logo">
        <a-input v-model="form.model.logo" />
      </a-form-model-item>
      <a-form-model-item label="分组：" prop="team">
        <a-auto-complete v-model="form.model.team" :dataSource="teams" allowClear />
      </a-form-model-item>
      <a-form-model-item label="描述：" prop="description">
        <a-input v-model="form.model.description" :autoSize="{ minRows: 5 }" type="textarea" />
      </a-form-model-item>
    </a-form-model>
    <template #footer>
      <ReactiveButton
        :errored="form.errored"
        :loading="form.saving"
        erroredText="保存失败"
        loadedText="保存成功"
        text="保存"
        type="primary"
        @callback="$emit('saved')"
        @click="handleCreateOrUpdateLink"
      ></ReactiveButton>
      <a-button @click="$emit('close')">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: 'LinkCreateModal',
  props: {
    form_: Object,
    teams: Array
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '* 友情链接名称不能为空', trigger: ['change'] },
          { max: 255, message: '* 友情链接名称的字符长度不能超过 255', trigger: ['change'] }
        ],
        url: [
          { required: true, message: '* 友情链接地址不能为空', trigger: ['change'] },
          { max: 1023, message: '* 友情链接地址的字符长度不能超过 1023', trigger: ['change'] },
          { type: 'url', message: '* 友情链接地址格式有误', trigger: ['change'] }
        ],
        logo: [{ max: 1023, message: '* 友情链接 Logo 的字符长度不能超过 1023', trigger: ['change'] }],
        description: [{ max: 255, message: '* 友情链接描述的字符长度不能超过 255', trigger: ['change'] }],
        team: [{ max: 255, message: '* 友情链接分组的字符长度 255', trigger: ['change'] }]
      }
    }
  },
  computed: {
    form: {
      get() {
        return this.form_
      },
      set(value) {
        this.$emit('update:form', value)
      }
    },
    title() {
      if (this.isUpdateMode) {
        return '修改友情链接'
      }
      return '添加友情链接'
    },
    isUpdateMode() {
      return !!this.form.model.id
    },
    dragOptions() {
      return {
        animation: 200,
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  methods: {
    handleCreateOrUpdateLink() {
      const _this = this
      _this.$refs.linkForm.validate(valid => {
        if (valid) {
          _this.$emit('createOrUpdateLink')
        }
      })
    }
  }
}
</script>

<style scoped></style>
