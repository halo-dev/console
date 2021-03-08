<template>
  <a-drawer
    title="评论详情"
    :width="isMobile() ? '100%' : '480'"
    closable
    :visible="visible"
    destroyOnClose
    @close="onClose"
  >
    <a-row type="flex" align="middle">
      <a-col :span="24">
        <a-list itemLayout="horizontal">
          <a-list-item>
            <a-list-item-meta :description="comment.author">
              <template #title>
                <span>评论者昵称：</span>
              </template>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta :description="comment.email">
              <template #title>
                <span>评论者邮箱：</span>
              </template>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta :description="comment.ipAddress">
              <template #title>
                <span>评论者 IP：</span>
              </template>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <template #description>
                <a target="_blank" :href="comment.authorUrl">{{ comment.authorUrl }}</a>
              </template>
              <template #title>
                <span>评论者网址：</span>
              </template>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <template #description>
                <span>
                  <a-badge :status="comment.statusProperty.status" :text="comment.statusProperty.text" />
                </span>
              </template>
              <template #title>
                <span>评论状态：</span>
              </template>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <template #description v-if="this.type == 'posts'">
                <a target="_blank" :href="comment.post.fullPath">{{ comment.post.title }}</a>
              </template>
              <template #description v-else-if="this.type == 'sheets'">
                <a target="_blank" :href="comment.sheet.fullPath">{{ comment.sheet.title }}</a>
              </template>
              <template #title v-if="this.type == 'posts'">
                <span>评论文章：</span>
              </template>
              <template #title v-else-if="this.type == 'sheets'">
                <span>评论页面：</span>
              </template>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <template #description v-if="editable">
                <a-input type="textarea" :autoSize="{ minRows: 5 }" v-model="comment.content" />
              </template>
              <template #description>
                <span v-html="comment.content" v-else></span>
              </template>
              <template #title>
                <span>评论内容：</span>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>
    <a-divider class="divider-transparent" />
    <div class="bottom-control">
      <a-space>
        <a-button type="dashed" @click="handleEditComment" v-if="!editable">编辑</a-button>
        <a-button type="primary" @click="handleUpdateComment" v-if="editable">保存</a-button>
        <a-popconfirm title="你确定要将此评论者加入黑名单？" okText="确定" cancelText="取消">
          <a-button type="danger">加入黑名单</a-button>
        </a-popconfirm>
      </a-space>
    </div>
  </a-drawer>
</template>
<script>
import { mixin, mixinDevice } from '@/mixins/mixin.js'
import commentApi from '@/api/comment'
export default {
  name: 'CommentDetail',
  mixins: [mixin, mixinDevice],
  components: {},
  data() {
    return {
      editable: false,
      commentStatus: commentApi.commentStatus,
      keys: ['blog_url']
    }
  },
  model: {
    prop: 'visible',
    event: 'close'
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      required: false,
      default: true
    },
    type: {
      type: String,
      required: false,
      default: 'posts',
      validator: function(value) {
        return ['posts', 'sheets', 'journals'].indexOf(value) !== -1
      }
    }
  },
  methods: {
    handleEditComment() {
      this.editable = true
    },
    handleUpdateComment() {
      commentApi.update(this.type, this.comment.id, this.comment).then(response => {
        console.log('Updated comment', response.data.data)
        this.$message.success('评论修改成功！')
      })
      this.editable = false
    },
    onClose() {
      this.$emit('close', false)
    }
  }
}
</script>
