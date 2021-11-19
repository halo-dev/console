<template>
  <a-drawer
    :visible="visible"
    :width="isMobile() ? '100%' : '480'"
    closable
    destroyOnClose
    title="评论详情"
    @close="onClose"
  >
    <a-row align="middle" type="flex">
      <a-col :span="24">
        <a-list itemLayout="horizontal">
          <a-list-item>
            <a-list-item-meta :description="comment.author">
              <span slot="title">评论者昵称：</span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta :description="comment.email">
              <span slot="title">评论者邮箱：</span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta :description="comment.ipAddress">
              <span slot="title">评论者 IP：</span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <a slot="description" :href="comment.authorUrl" target="_blank">{{ comment.authorUrl }}</a>
              <span slot="title">评论者网址：</span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <span slot="description">
                <a-badge :status="comment.statusProperty.status" :text="comment.statusProperty.text" />
              </span>
              <span slot="title">评论状态：</span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <a v-if="this.type == 'posts'" slot="description" :href="comment.post.fullPath" target="_blank">{{
                comment.post.title
              }}</a>
              <a v-else-if="this.type == 'sheets'" slot="description" :href="comment.sheet.fullPath" target="_blank">{{
                comment.sheet.title
              }}</a>
              <span v-if="this.type == 'posts'" slot="title">评论文章：</span>
              <span v-else-if="this.type == 'sheets'" slot="title">评论页面：</span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <template v-if="editable" slot="description">
                <a-input v-model="comment.content" :autoSize="{ minRows: 5 }" type="textarea" />
              </template>
              <span v-else slot="description" v-html="comment.content"></span>
              <span slot="title">评论内容：</span>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>
    <a-divider class="divider-transparent" />
    <div class="bottom-control">
      <a-space>
        <a-button v-if="!editable" type="dashed" @click="handleEditComment">编辑</a-button>
        <a-button v-if="editable" type="primary" @click="handleUpdateComment">保存</a-button>
        <a-popconfirm cancelText="取消" okText="确定" title="你确定要将此评论者加入黑名单？">
          <a-button type="danger">加入黑名单</a-button>
        </a-popconfirm>
      </a-space>
    </div>
  </a-drawer>
</template>
<script>
import { mixin, mixinDevice } from '@/mixins/mixin.js'
import apiClient from '@/utils/api-client'

export default {
  name: 'CommentDetail',
  mixins: [mixin, mixinDevice],
  components: {},
  data() {
    return {
      editable: false,
      commentStatus: {
        PUBLISHED: {
          value: 'PUBLISHED',
          color: 'green',
          status: 'success',
          text: '已发布'
        },
        AUDITING: {
          value: 'AUDITING',
          color: 'yellow',
          status: 'warning',
          text: '待审核'
        },
        RECYCLE: {
          value: 'RECYCLE',
          color: 'red',
          status: 'error',
          text: '回收站'
        }
      },
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
      apiClient.comment.update(this.type, this.comment.id, this.comment).then(response => {
        this.$log.debug('Updated comment', response.data)
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
