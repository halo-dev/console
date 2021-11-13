<template>
  <a-modal v-model="modalVisible" :width="680" :bodyStyle="{ padding: 0 }">
    <template #title> 文章设置 <a-icon v-if="loading" type="loading" /> </template>

    <div class="card-container">
      <a-tabs type="card">
        <a-tab-pane key="normal" tab="常规">
          <a-form labelAlign="left" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-form-item label="文章标题">
              <a-input v-model="form.model.title" />
            </a-form-item>
            <a-form-item label="文章别名" help="https://ryanc.cc/archives/halo-1410-released.html">
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
            <a-form-item label="开启评论">
              <a-switch v-model="form.model.disallowComment" />
            </a-form-item>
            <a-form-item label="是否置顶">
              <a-switch v-model="form.model.topPriority" />
            </a-form-item>
            <a-form-item label="发表时间：">
              <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="选择文章发表时间" />
            </a-form-item>
            <a-form-item label="访问密码：">
              <a-input-password v-model="form.model.password" autocomplete="new-password" />
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
      <a-button key="back" :disabled="loading" @click="modalVisible = false">
        取消
      </a-button>
      <a-button key="submit" :disabled="loading" type="primary">
        保存
      </a-button>
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
// import { datetimeFormat } from '@/utils/datetime'
import pinyin from 'tiny-pinyin'
// import { mapGetters } from 'vuex'

// apis
// import categoryApi from '@/api/category'
// import postApi from '@/api/post'
// import themeApi from '@/api/theme'

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
    }
  },
  data() {
    return {
      form: {
        model: {}
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
  watch: {
    modalVisible(value) {
      if (value) {
        this.form.model = Object.assign({}, this.post)
      }
    },
    post: {
      deep: true,
      handler(value) {
        this.form.model = Object.assign({}, value)
      }
    }
  },
  methods: {
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
    }
  }
}
</script>
