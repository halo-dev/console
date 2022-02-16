<template>
  <page-view :title="postToStage.title ? postToStage.title : '新文章'" affix>
    <template slot="extra">
      <a-space>
        <a-button :loading="previewSaving" @click="handlePreviewClick">预览</a-button>
        <a-button type="primary" @click="postSettingVisible = true">发布</a-button>
      </a-space>
    </template>
    <a-row :gutter="12">
      <a-col :span="24">
        <div class="mb-4">
          <a-input v-model="postToStage.title" placeholder="请输入文章标题" size="large" />
        </div>
        <div id="editor" :style="{ height: editorHeight }">
          <MarkdownEditor
            :originalContent="postToStage.originalContent"
            @onContentChange="onContentChange"
            @onSaveDraft="handleSaveDraft()"
          />
        </div>
      </a-col>
    </a-row>

    <PostSettingModal
      :post="postToStage"
      :savedCallback="onPostSavedCallback"
      :visible.sync="postSettingVisible"
      @onUpdate="onUpdateFromSetting"
    />
  </page-view>
</template>

<script>
// components
import PostSettingModal from './components/PostSettingModal'
import MarkdownEditor from '@/components/Editor/MarkdownEditor'
import { PageView } from '@/layouts'

// libs
import { mixin, mixinDevice, mixinPostEdit } from '@/mixins/mixin.js'
import { datetimeFormat } from '@/utils/datetime'
import apiClient from '@/utils/api-client'

export default {
  mixins: [mixin, mixinDevice, mixinPostEdit],
  components: {
    PostSettingModal,
    MarkdownEditor,
    PageView
  },
  data() {
    return {
      postSettingVisible: false,
      postToStage: {},
      contentChanges: 0,
      draftSaving: false,
      previewSaving: false,
      draftSaveErrored: false
    }
  },
  beforeRouteEnter(to, from, next) {
    // Get post id from query
    const postId = to.query.postId
    next(vm => {
      if (postId) {
        apiClient.post.get(postId).then(response => {
          vm.postToStage = response.data
        })
      }
    })
  },
  destroyed() {
    if (window.onbeforeunload) {
      window.onbeforeunload = null
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.contentChanges <= 1) {
      next()
    } else {
      this.$confirm({
        title: '当前页面数据未保存，确定要离开吗？',
        content: () => <div style="color:red;">如果离开当面页面，你的数据很可能会丢失！</div>,
        onOk() {
          next()
        },
        onCancel() {
          next(false)
        }
      })
    }
  },
  mounted() {
    window.onbeforeunload = function (e) {
      e = e || window.event
      if (e) {
        e.returnValue = '当前页面数据未保存，确定要离开吗？'
      }
      return '当前页面数据未保存，确定要离开吗？'
    }
  },
  methods: {
    async handleSaveDraft() {
      if (this.postToStage.id) {
        // Update the post content
        try {
          await apiClient.post.updateDraftById(this.postToStage.id, this.postToStage.originalContent)
          this.handleRestoreSavedStatus()
        } catch (e) {
          this.$log.error('Failed to update post content', e)
        }
      } else {
        await this.handleCreatePost()
      }
    },

    async handleCreatePost() {
      if (!this.postToStage.title) {
        this.postToStage.title = datetimeFormat(new Date(), 'YYYY-MM-DD-HH-mm-ss')
      }
      // Create the post
      try {
        const { data } = await apiClient.post.create(this.postToStage)
        this.postToStage = data
        this.handleRestoreSavedStatus()
      } catch (e) {
        this.$log.error('Failed to create post', e)
      }
    },

    async handlePreviewClick() {
      this.previewSaving = true
      if (this.postToStage.id) {
        // Update the post content
        await apiClient.post.updateDraftById(this.postToStage.id, this.postToStage.originalContent)
        await this.handleOpenPreview()
      } else {
        await this.handleCreatePost()
        await this.handleOpenPreview()
      }
    },

    async handleOpenPreview() {
      try {
        const response = await apiClient.post.getPreviewLinkById(this.postToStage.id)
        window.open(response, '_blank')
        this.handleRestoreSavedStatus()
      } catch (e) {
        this.$log.error('Failed to get preview link', e)
      } finally {
        setTimeout(() => {
          this.previewSaving = false
        }, 400)
      }
    },

    handleRestoreSavedStatus() {
      this.contentChanges = 0
    },
    onContentChange(val) {
      this.contentChanges++
      this.postToStage.originalContent = val
    },
    onPostSavedCallback() {
      this.contentChanges = 0
      this.$router.push({ name: 'PostList' })
    },
    onUpdateFromSetting(post) {
      this.postToStage = post
    }
  }
}
</script>
