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
            <a-form-item label="文章标题">
              <a-input v-model="form.model.title" />
            </a-form-item>
            <a-form-item :help="fullPath" label="文章别名">
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
            <a-form-item label="分类目录">
              <a-space direction="vertical">
                <category-tree ref="categoryTree" v-model="form.model.categoryIds" />
                <a-button type="dashed" @click="categoryCreateModalVisible = true">新增</a-button>
              </a-space>
            </a-form-item>
            <a-form-item label="标签">
              <TagSelect v-model="form.model.tagIds" />
            </a-form-item>
            <a-form-item label="摘要">
              <a-input
                v-model="form.model.summary"
                :autoSize="{ minRows: 5 }"
                placeholder="如不填写，会从文章中自动截取"
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
            <a-form-item label="是否置顶">
              <a-switch v-model="topPriority" />
            </a-form-item>
            <a-form-item label="发表时间：">
              <a-date-picker
                :defaultValue="createTimeDefaultValue"
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择文章发表时间"
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
            <a-form-item label="访问密码：">
              <a-input-password v-model="form.model.password" autocomplete="new-password" />
            </a-form-item>
            <a-form-item label="封面图：">
              <a-space direction="vertical">
                <img
                  :src="form.model.thumbnail || '/images/placeholder.jpg'"
                  alt="Post cover thumbnail"
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
                placeholder="多个关键词以英文逗号隔开，如不填写，将自动使用标签作为关键词"
                type="textarea"
              />
            </a-form-item>
            <a-form-item label="自定义描述">
              <a-input
                v-model="form.model.metaDescription"
                :autoSize="{ minRows: 5 }"
                placeholder="如不填写，会从文章中自动截取"
                type="textarea"
              />
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="meta" tab="元数据">
          <MetaEditor :metas.sync="form.model.metas" :targetId="form.model.id" target="post" />
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
      @confirm="handleSelectPostThumbnail"
    />
    <CategoryCreateModal :visible.sync="categoryCreateModalVisible" @close="onCategoryCreateModalClose" />
  </a-modal>
</template>
<script>
// components
import CategoryTree from '../Category/CategoryTree'
import TagSelect from '../Tag/TagSelect'
import MetaEditor from '@/components/Post/MetaEditor'
import CategoryCreateModal from '@/components/Category/CategoryCreateModal'

// libs
import { mixin, mixinDevice } from '@/mixins/mixin.js'
import { datetimeFormat } from '@/utils/datetime'
import pinyin from 'tiny-pinyin'
import { mapGetters } from 'vuex'
import { postStatuses } from '@/core/constant'

// apis
import apiClient from '@/utils/api-client'

export default {
  name: 'PostSettingModal',
  mixins: [mixin, mixinDevice],
  components: {
    CategoryTree,
    TagSelect,
    MetaEditor,
    CategoryCreateModal
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
    post: {
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
      postStatuses,
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

      attachmentSelectVisible: false,
      categoryCreateModalVisible: false
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
      return this.form.model.id ? '文章设置' : '文章发布'
    },
    createTimeDefaultValue() {
      if (this.form.model.createTime) {
        const date = new Date(this.form.model.createTime)
        return datetimeFormat(date, 'YYYY-MM-DD HH:mm:ss')
      }
      return datetimeFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
    },
    topPriority: {
      get() {
        if (this.form.model.topPriority === undefined) {
          return false
        }
        return this.form.model.topPriority !== 0
      },
      set(value) {
        this.$set(this.form.model, 'topPriority', value ? 1 : 0)
      }
    },
    fullPath() {
      const { post_permalink_type, archives_prefix, blog_url, path_suffix: path_suffix = '' } = this.options
      const { slug: slug = '{slug}', createTime: createTime = new Date(), id: id = '{id}' } = this.form.model

      switch (post_permalink_type) {
        case 'DEFAULT':
          return `${blog_url}/${archives_prefix}/${slug}${path_suffix}`
        case 'YEAR':
          return `${blog_url}${datetimeFormat(createTime, '/YYYY/')}${slug}${path_suffix}`
        case 'DATE':
          return `${blog_url}${datetimeFormat(createTime, '/YYYY/MM/')}${slug}${path_suffix}`
        case 'DAY':
          return `${blog_url}${datetimeFormat(createTime, '/YYYY/MM/DD/')}${slug}${path_suffix}`
        case 'ID':
          return `${blog_url}/?p=${id}`
        case 'ID_SLUG':
          return `${blog_url}/${archives_prefix}/${id}${path_suffix}`
        default:
          return ''
      }
    },
    hasId() {
      return !!this.form.model.id
    },
    draftSaveVisible() {
      const { draftSaving, publishing } = this.form
      return (this.form.model.status !== postStatuses.DRAFT.value || !this.hasId || draftSaving) && !publishing
    },
    publishVisible() {
      const { draftSaving, publishing } = this.form
      return ((this.form.model.status === postStatuses.DRAFT.value && this.hasId) || publishing) && !draftSaving
    }
  },
  watch: {
    modalVisible(value) {
      if (value) {
        this.form.model = Object.assign({}, this.post)

        if (!this.form.model.slug && !this.form.model.id) {
          this.handleGenerateSlug()
        }
      }
    },
    post: {
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
     * Creates or updates a post
     */
    async handleCreateOrUpdate() {
      if (!this.form.model.title) {
        this.$notification['error']({
          message: '提示',
          description: '文章标题不能为空！'
        })
        throw new Error('文章标题不能为空！')
      }

      this.form.model.keepRaw = true
      try {
        if (this.hasId) {
          await apiClient.post.update(this.form.model.id, this.form.model)
        } else {
          await apiClient.post.create(this.form.model)
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
          this.form.model.status = this.postStatuses.PUBLISHED.value
        }

        await this.handleCreateOrUpdate()
      } catch (e) {
        this.form.saveErrored = true
        this.$log.error('Failed to save post', e)
      } finally {
        setTimeout(() => {
          this.form.saving = false
        }, 400)
      }
    },

    async handlePublish() {
      try {
        this.form.publishing = true
        this.form.model.status = this.postStatuses.PUBLISHED.value

        await this.handleCreateOrUpdate()
      } catch (e) {
        this.form.publishErrored = true
        this.$log.error('Failed to publish post', e)
      } finally {
        setTimeout(() => {
          this.form.publishing = false
        }, 400)
      }
    },

    async handleSaveDraft() {
      try {
        this.form.draftSaving = true
        this.form.model.status = this.postStatuses.DRAFT.value

        await this.handleCreateOrUpdate()
      } catch (e) {
        this.form.draftSaveErrored = true
        this.$log.error('Failed to save draft post', e)
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
        const response = await apiClient.theme.listCustomPostTemplates()

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
     * Select post thumbnail
     * @param data
     */
    handleSelectPostThumbnail({ raw }) {
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
    },

    onCategoryCreateModalClose() {
      this.$refs.categoryTree.handleListCategories()
    }
  }
}
</script>
