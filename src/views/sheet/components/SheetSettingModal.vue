<template>
  <a-modal
    v-model="modalVisible"
    :afterClose="onClosed"
    :bodyStyle="{ padding: 0 }"
    :maskClosable="false"
    :width="680"
    destroyOnClose
  >
    <template #title>
      {{ modalTitle }}
      <a-icon v-if="loading" type="loading" />
    </template>

    <div class="card-container">
      <a-tabs type="card">
        <a-tab-pane key="normal" tab="常规">
          <a-form :label-col="form.labelCol" :wrapper-col="form.wrapperCol" labelAlign="left">
            <a-form-item label="页面标题">
              <a-input v-model="form.model.title" />
            </a-form-item>
            <a-form-item :help="fullPath" label="页面别名">
              <a-input v-model="form.model.slug">
                <template #addonAfter>
                  <a-popconfirm
                    cancel-text="取消"
                    ok-text="确定"
                    placement="left"
                    title="是否确定根据标题重新生成别名？"
                    @confirm="handleGenerateSlug"
                  >
                    <a-icon class="cursor-pointer" type="sync" />
                  </a-popconfirm>
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="摘要">
              <a-input
                v-model="form.model.summary"
                :autoSize="{ minRows: 5 }"
                placeholder="如不填写，会从页面中自动截取"
                type="textarea"
              />
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="advanced" tab="高级">
          <a-form :label-col="form.labelCol" :wrapper-col="form.wrapperCol" labelAlign="left">
            <a-form-item label="禁止评论">
              <a-switch v-model="form.model.disallowComment" />
            </a-form-item>
            <a-form-item label="发表时间：">
              <a-date-picker
                :defaultValue="createTimeDefaultValue"
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择页面发表时间"
                showTime
                @change="onCreateTimeSelect"
                @ok="onCreateTimeSelect"
              />
            </a-form-item>
            <a-form-item label="自定义模板：">
              <a-select v-model="form.model.template">
                <a-select-option key="" value="">无</a-select-option>
                <a-select-option v-for="template in templates" :key="template" :value="template">
                  {{ template }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="封面图：">
              <a-space direction="vertical">
                <img
                  :src="form.model.thumbnail || '/images/placeholder.jpg'"
                  alt="Sheet cover thumbnail"
                  class="w-1/2 cursor-pointer"
                  style="border-radius: 4px"
                  @click="attachmentSelectVisible = true"
                />
                <a-input
                  v-model="form.model.thumbnail"
                  allow-clear
                  placeholder="点击封面图选择图片，或者输入外部链接"
                ></a-input>
              </a-space>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="seo" tab="SEO">
          <a-form :label-col="form.labelCol" :wrapper-col="form.wrapperCol" labelAlign="left">
            <a-form-item label="自定义关键词">
              <a-input
                v-model="form.model.metaKeywords"
                :autoSize="{ minRows: 5 }"
                placeholder="多个关键词以英文逗号隔开"
                type="textarea"
              />
            </a-form-item>
            <a-form-item label="自定义描述">
              <a-input
                v-model="form.model.metaDescription"
                :autoSize="{ minRows: 5 }"
                placeholder="如不填写，会从页面中自动截取"
                type="textarea"
              />
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="meta" tab="元数据">
          <MetaEditor :metas.sync="form.model.metas" :targetId="form.model.id" target="sheet" />
        </a-tab-pane>
      </a-tabs>
    </div>
    <template #footer>
      <slot name="extraFooter" />
      <ReactiveButton
        v-if="draftSaveVisible"
        :errored="form.draftSaveErrored"
        :loading="form.draftSaving"
        :text="`${hasId ? '转为' : '保存'}草稿`"
        erroredText="保存失败"
        loadedText="保存成功"
        type="danger"
        @callback="handleSavedCallback()"
        @click="handleSaveDraft()"
      ></ReactiveButton>
      <ReactiveButton
        v-if="publishVisible"
        :errored="form.publishErrored"
        :loading="form.publishing"
        erroredText="发布失败"
        loadedText="发布成功"
        text="转为发布"
        @callback="handleSavedCallback()"
        @click="handlePublish()"
      ></ReactiveButton>
      <ReactiveButton
        :errored="form.saveErrored"
        :erroredText="`${hasId ? '保存' : '发布'}失败`"
        :loadedText="`${hasId ? '保存' : '发布'}成功`"
        :loading="form.saving"
        :text="`${hasId ? '保存' : '发布'}`"
        @callback="handleSavedCallback()"
        @click="handleSave()"
      ></ReactiveButton>
      <a-button :disabled="loading" @click="modalVisible = false">关闭</a-button>
    </template>
    <AttachmentSelectModal
      :multiSelect="false"
      :visible.sync="attachmentSelectVisible"
      @confirm="handleSelectSheetThumbnail"
    />
  </a-modal>
</template>
<script>
// components
import MetaEditor from '@/components/Post/MetaEditor'

// libs
import { mixin, mixinDevice } from '@/mixins/mixin.js'
import { datetimeFormat } from '@/utils/datetime'
import pinyin from 'tiny-pinyin'
import { mapGetters } from 'vuex'
import { sheetStatuses } from '@/core/constant'

// apis
import apiClient from '@/utils/api-client'

export default {
  name: 'SheetSettingModal',
  mixins: [mixin, mixinDevice],
  components: {
    MetaEditor
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    sheet: {
      type: Object,
      default: () => ({})
    },
    savedCallback: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      sheetStatuses,
      form: {
        model: {},
        saving: false,
        saveErrored: false,
        draftSaving: false,
        draftSaveErrored: false,
        publishing: false,
        publishErrored: false,
        labelCol: { sm: { span: 4 }, xs: { span: 24 } },
        wrapperCol: { sm: { span: 20 }, xs: { span: 24 } }
      },
      templates: [],
      attachmentSelectVisible: false
    }
  },
  computed: {
    ...mapGetters(['options']),
    modalVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    },
    modalTitle() {
      return this.form.model.id ? '页面设置' : '页面发布'
    },
    createTimeDefaultValue() {
      if (this.form.model.createTime) {
        const date = new Date(this.form.model.createTime)
        return datetimeFormat(date, 'YYYY-MM-DD HH:mm:ss')
      }
      return datetimeFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
    },
    fullPath() {
      const { sheet_permalink_type, blog_url, sheet_prefix, path_suffix: path_suffix = '' } = this.options
      const { slug: slug = '{slug}' } = this.form.model

      switch (sheet_permalink_type) {
        case 'SECONDARY':
          return `${blog_url}/${sheet_prefix}/${slug}${path_suffix}`
        case 'ROOT':
          return `${blog_url}/${slug}${path_suffix}`
        default:
          return ''
      }
    },
    hasId() {
      return !!this.form.model.id
    },
    draftSaveVisible() {
      const { draftSaving, publishing } = this.form
      return (this.form.model.status !== sheetStatuses.DRAFT.value || !this.hasId || draftSaving) && !publishing
    },
    publishVisible() {
      const { draftSaving, publishing } = this.form
      return ((this.form.model.status === sheetStatuses.DRAFT.value && this.hasId) || publishing) && !draftSaving
    }
  },
  watch: {
    modalVisible(value) {
      if (value) {
        this.form.model = Object.assign({}, this.sheet)
        if (!this.form.model.slug && !this.form.model.id) {
          this.handleGenerateSlug()
        }
      }
    },
    sheet: {
      deep: true,
      handler(value) {
        this.form.model = Object.assign({}, value)
      }
    }
  },
  created() {
    this.handleListCustomTemplates()
  },
  methods: {
    /**
     * Creates or updates a sheet
     */
    async handleCreateOrUpdate() {
      if (!this.form.model.title) {
        this.$notification['error']({
          message: '提示',
          description: '页面标题不能为空！'
        })
        throw new Error('文章标题不能为空！')
      }
      this.form.model.keepRaw = true
      try {
        if (this.hasId) {
          await apiClient.sheet.update(this.form.model.id, this.form.model)
        } else {
          await apiClient.sheet.create(this.form.model)
        }
      } catch (error) {
        this.$log.error(error)
        throw new Error(error)
      }
    },

    async handleSave() {
      try {
        this.form.saving = true

        const { status } = this.form.model

        if (!status) {
          this.form.model.status = this.sheetStatuses.PUBLISHED.value
        }

        await this.handleCreateOrUpdate()
      } catch (e) {
        this.form.saveErrored = true
        this.$log.error('Failed to save sheet', e)
      } finally {
        setTimeout(() => {
          this.form.saving = false
        }, 400)
      }
    },

    async handlePublish() {
      try {
        this.form.publishing = true
        this.form.model.status = this.sheetStatuses.PUBLISHED.value

        await this.handleCreateOrUpdate()
      } catch (e) {
        this.form.publishErrored = true
        this.$log.error('Failed to publish sheet', e)
      } finally {
        setTimeout(() => {
          this.form.publishing = false
        }, 400)
      }
    },

    async handleSaveDraft() {
      try {
        this.form.draftSaving = true
        this.form.model.status = this.sheetStatuses.DRAFT.value

        await this.handleCreateOrUpdate()
      } catch (e) {
        this.form.draftSaveErrored = true
        this.$log.error('Failed to save draft sheet', e)
      } finally {
        setTimeout(() => {
          this.form.draftSaving = false
        }, 400)
      }
    },
    /**
     * Handle saved callback event
     */
    handleSavedCallback() {
      if (this.form.saveErrored || this.form.draftSaveErrored || this.form.publishErrored) {
        this.form.saveErrored = false
        this.form.draftSaveErrored = false
        this.form.publishErrored = false
      } else {
        this.savedCallback && this.savedCallback()
      }
    },
    /**
     * Handle list custom templates
     */
    async handleListCustomTemplates() {
      try {
        const response = await apiClient.theme.listCustomSheetTemplates()
        this.templates = response.data
      } catch (error) {
        this.$log.error(error)
      }
    },
    /**
     * Handle create time selected event
     */
    onCreateTimeSelect(value) {
      this.form.model.createTime = value.valueOf()
    },
    /**
     * Generate slug
     */
    handleGenerateSlug() {
      if (this.form.model.title) {
        if (pinyin.isSupported()) {
          let result = ''
          const tokens = pinyin.parse(this.form.model.title.replace(/\s+/g, '').toLowerCase())
          let lastToken
          tokens.forEach(token => {
            if (token.type === 2) {
              const target = token.target ? token.target.toLowerCase() : ''
              result += result && !/\n|\s/.test(lastToken.target) ? '-' + target : target
            } else {
              result += (lastToken && lastToken.type === 2 ? '-' : '') + token.target
            }
            lastToken = token
          })
          this.$set(this.form.model, 'slug', result)
        }
      }
    },
    /**
     * Select sheet thumbnail
     * @param data
     */
    handleSelectSheetThumbnail({ raw }) {
      if (raw.length) {
        this.form.model.thumbnail = encodeURI(raw[0].path)
      }
      this.attachmentSelectVisible = false
    },
    /**
     * Handle modal close event
     */
    onClosed() {
      this.$emit('onClose')
      this.$emit('onUpdate', this.form.model)
    }
  }
}
</script>
