<template>
  <a-modal v-model="modalVisible" :afterClose="onClose" :width="512" destroyOnClose title="新建分类">
    <a-form-model
      ref="categoryForm"
      :label-col="form.labelCol"
      :model="form.model"
      :rules="form.rules"
      :wrapper-col="form.wrapperCol"
      labelAlign="left"
    >
      <a-form-model-item help="* 页面上所显示的名称" label="名称：" prop="name">
        <a-input ref="nameInput" v-model="form.model.name" />
      </a-form-model-item>
      <a-form-model-item help="* 一般为单个分类页面的标识，最好为英文" label="别名：" prop="slug">
        <a-input v-model="form.model.slug" />
      </a-form-model-item>
      <a-form-model-item label="上级目录：" prop="parentId">
        <category-select-tree :categories="list.data" :category-id.sync="form.model.parentId" />
      </a-form-model-item>
      <a-form-model-item help="* 在分类页面可展示，需要主题支持" label="封面图：" prop="thumbnail">
        <AttachmentInput v-model="form.model.thumbnail" title="选择封面图" />
      </a-form-model-item>
      <a-form-model-item help="* 分类密码" label="密码：" prop="password">
        <a-input-password v-model="form.model.password" autocomplete="new-password" />
      </a-form-model-item>
      <a-form-model-item help="* 分类描述，需要主题支持" label="描述：" prop="description">
        <a-input v-model="form.model.description" :autoSize="{ minRows: 3 }" type="textarea" />
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
        @callback="handleSavedCallback"
        @click="handleCreate"
      ></ReactiveButton>
      <a-button @click="modalVisible = false">关闭</a-button>
    </template>
  </a-modal>
</template>
<script>
import CategorySelectTree from '@/components/Category/CategorySelectTree'
import apiClient from '@/utils/api-client'

export default {
  name: 'CategoryCreateModal',
  components: {
    CategorySelectTree
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: {
        data: [],
        loading: false
      },
      form: {
        model: {},
        saving: false,
        errored: false,
        rules: {
          name: [
            { required: true, message: '* 分类名称不能为空', trigger: ['change'] },
            { max: 255, message: '* 分类名称的字符长度不能超过 255', trigger: ['change'] }
          ],
          slug: [{ max: 255, message: '* 分类别名的字符长度不能超过 255', trigger: ['change'] }],
          thumbnail: [{ max: 1023, message: '* 封面图链接的字符长度不能超过 1023', trigger: ['change'] }],
          description: [{ max: 100, message: '* 分类描述的字符长度不能超过 100', trigger: ['change'] }]
        },
        labelCol: { sm: { span: 4 }, xs: { span: 24 } },
        wrapperCol: { sm: { span: 20 }, xs: { span: 24 } }
      }
    }
  },
  computed: {
    modalVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    }
  },
  created() {
    this.handleListCategories()
  },
  watch: {
    modalVisible(value) {
      if (value) {
        this.$nextTick(() => {
          this.$refs.nameInput.focus()
        })
      }
    }
  },
  methods: {
    async handleListCategories() {
      try {
        this.list.loading = true

        const { data } = await apiClient.category.list({})
        this.list.data = data
      } catch (e) {
        this.$log.error('Failed to get categories', e)
      } finally {
        this.list.loading = false
      }
    },

    handleCreate() {
      this.$refs.categoryForm.validate(async valid => {
        if (valid) {
          try {
            this.form.saving = true

            await apiClient.category.create(this.form.model)
          } catch (e) {
            this.form.errored = true
            this.$log.error('Failed to create category', e)
          } finally {
            setTimeout(() => {
              this.form.saving = false
            }, 400)
          }
        }
      })
    },

    handleSavedCallback() {
      if (this.form.errored) {
        this.form.errored = false
      } else {
        this.form.model = {}
        this.handleListCategories()
      }
    },

    onClose() {
      this.$emit('close')
    }
  }
}
</script>
