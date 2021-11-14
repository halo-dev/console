<template>
  <a-modal
    v-model="modalVisible"
    :width="680"
    :maskClosable="false"
    :bodyStyle="{ padding: 0 }"
    destroyOnClose
    :afterClose="onClosed"
  >
    <template #title> {{ modalTitle }} <a-icon v-if="loading" type="loading" /> </template>

    <div class="card-container">
      <a-tabs type="card">
        <a-tab-pane key="normal" tab="常规">
          <a-form labelAlign="left" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-form-item label="文章标题">
              <a-input v-model="form.model.title" />
            </a-form-item>
            <a-form-item label="文章别名" :help="fullPath">
              <a-input v-model="form.model.slug">
                <template #addonAfter>
                  <a-popconfirm
                    title="是否确定根据标题重新生成别名？"
                    ok-text="确定"
                    cancel-text="取消"
                    placement="left"
                    @confirm="handleGenerateSlug"
                  >
                    <a-icon class="cursor-pointer" type="sync" />
                  </a-popconfirm>
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="分类目录">
              <category-tree v-model="form.model.categoryIds" />
            </a-form-item>
            <a-form-item label="标签">
              <TagSelect v-model="form.model.tagIds" />
            </a-form-item>
            <a-form-item label="摘要">
              <a-input
                type="textarea"
                v-model="form.model.summary"
                :autoSize="{ minRows: 5 }"
                placeholder="如不填写，会从文章中自动截取"
              />
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="advanced" tab="高级">
          <a-form labelAlign="left" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-form-item label="禁止评论">
              <a-switch v-model="form.model.disallowComment" />
            </a-form-item>
            <a-form-item label="是否置顶">
              <a-switch v-model="topPriority" />
            </a-form-item>
            <a-form-item label="发表时间：">
              <a-date-picker
                showTime
                :defaultValue="pickerDefaultValue"
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择文章发表时间"
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
              <div class="post-thumb">
                <a-space direction="vertical">
                  <img
                    class="img"
                    :src="form.model.thumbnail || '/images/placeholder.jpg'"
                    @click="thumbDrawerVisible = true"
                  />
                  <a-input v-model="form.model.thumbnail" placeholder="点击封面图选择图片，或者输入外部链接"></a-input>
                  <a-button type="dashed" @click="form.model.thumbnail = null">移除</a-button>
                </a-space>
              </div>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="seo" tab="SEO">
          <a-form labelAlign="left" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-form-item label="自定义关键词">
              <a-input
                type="textarea"
                v-model="form.model.metaKeywords"
                :autoSize="{ minRows: 5 }"
                placeholder="多个关键词以英文逗号隔开，如不填写，将自动使用标签作为关键词"
              />
            </a-form-item>
            <a-form-item label="自定义描述">
              <a-input
                type="textarea"
                v-model="form.model.metaDescription"
                :autoSize="{ minRows: 5 }"
                placeholder="如不填写，会从文章中自动截取"
              />
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="meta" tab="元数据">
          元数据
        </a-tab-pane>
      </a-tabs>
    </div>
    <template slot="footer">
      <slot name="extraFooter" />
      <a-button :disabled="loading" @click="modalVisible = false">
        关闭
      </a-button>

      <ReactiveButton
        @click="handlePublishClick()"
        @callback="handleSavedCallback"
        :loading="form.saving"
        :errored="form.saveErrored"
        :text="`${form.model.id ? '保存' : '发布'}`"
        :loadedText="`${form.model.id ? '保存' : '发布'}成功`"
        :erroredText="`${form.model.id ? '保存' : '发布'}失败`"
      ></ReactiveButton>
    </template>
  </a-modal>
</template>
<script>
// components
import CategoryTree from './CategoryTree'
// import CategorySelectTree from './CategorySelectTree'
import TagSelect from './TagSelect'

// libs
import { mixin, mixinDevice } from '@/mixins/mixin.js'
import { datetimeFormat } from '@/utils/datetime'
import pinyin from 'tiny-pinyin'
import { mapGetters } from 'vuex'

// apis
import postApi from '@/api/post'
import themeApi from '@/api/theme'

export default {
  name: 'PostSettingModal',
  mixins: [mixin, mixinDevice],
  components: {
    CategoryTree,
    // CategorySelectTree,
    TagSelect
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
      form: {
        model: {},
        saving: false,
        saveErrored: false
      },

      templates: []
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
    pickerDefaultValue() {
      if (this.form.model.createTime) {
        const date = new Date(this.form.model.createTime)
        return datetimeFormat(date, 'YYYY-MM-DD HH:mm:ss')
      }
      return datetimeFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
    },
    topPriority: {
      get() {
        return this.form.model.topPriority === 0 ? false : true
      },
      set(value) {
        this.form.model.topPriority = value ? 1 : 0
      }
    },
    fullPath() {
      const permalinkType = this.options.post_permalink_type
      const blogUrl = this.options.blog_url
      const archivesPrefix = this.options.archives_prefix
      const pathSuffix = this.options.path_suffix || ''
      const slug = this.form.model.slug || '{slug}'
      const createTime = this.form.model.createTime || new Date()
      const id = this.form.model.id || '{id}'
      switch (permalinkType) {
        case 'DEFAULT':
          return `${blogUrl}/${archivesPrefix}/${slug}${pathSuffix}`
        case 'YEAR':
          return `${blogUrl}${datetimeFormat(createTime, '/YYYY/')}${slug}${pathSuffix}`
        case 'DATE':
          return `${blogUrl}${datetimeFormat(createTime, '/YYYY/MM/')}${slug}${pathSuffix}`
        case 'DAY':
          return `${blogUrl}${datetimeFormat(createTime, '/YYYY/MM/DD/')}${slug}${pathSuffix}`
        case 'ID':
          return `${blogUrl}/?p=${id}`
        case 'ID_SLUG':
          return `${blogUrl}/${archivesPrefix}/${id}${pathSuffix}`
        default:
          return ''
      }
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
    handlePublishClick() {
      this.form.model.status = 'PUBLISHED'
      this.handleCreateOrUpdate()
    },

    /**
     * Creates or updates a post
     */
    async handleCreateOrUpdate() {
      const { id } = this.form.model
      try {
        this.form.saving = true
        if (id) {
          await postApi.update(id, this.form.model, false)
        } else {
          await postApi.create(this.form.model, false)
        }
      } catch (error) {
        this.form.saveErrored = true
        this.$log.error(error)
      } finally {
        setTimeout(() => {
          this.form.saving = false
        }, 400)
      }
    },

    /**
     * Handle saved callback event
     */
    handleSavedCallback() {
      if (this.form.saveErrored) {
        this.form.saveErrored = false
      } else {
        this.savedCallback && this.savedCallback()
      }
    },

    /**
     * Handle list custom templates
     */
    async handleListCustomTemplates() {
      try {
        const response = await themeApi.customPostTpls()

        this.templates = response.data.data
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
     * Handle modal close event
     */
    onClosed() {
      this.$emit('onUpdate', this.form.model)
    }
  }
}
</script>
