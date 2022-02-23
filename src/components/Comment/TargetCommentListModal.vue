<template>
  <a-modal v-model="modalVisible" :afterClose="onClose" :width="1024" destroyOnClose title="评论列表">
    <a-list itemLayout="horizontal">
      <a-list-item>
        <a-list-item-meta>
          <template #description>
            <p class="comment-drawer-content" v-html="description"></p>
          </template>
          <template #title>
            <h3>{{ title }}</h3>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>

    <a-divider />

    <a-spin :spinning="list.loading">
      <a-empty v-if="list.data.length === 0" />
      <TargetCommentTreeNode
        v-for="(comment, index) in list.data"
        v-else
        :key="index"
        :comment="comment"
        :target="target"
        :target-id="targetId"
        @reload="handleGetComments"
      />
    </a-spin>

    <div class="page-wrapper">
      <a-pagination
        :current="pagination.page"
        :defaultPageSize="pagination.size"
        :pageSizeOptions="['10', '20', '50', '100']"
        :total="pagination.total"
        class="pagination"
        showLessItems
        showSizeChanger
        @change="handlePageChange"
        @showSizeChange="handlePageSizeChange"
      />
    </div>
  </a-modal>
</template>
<script>
import apiClient from '@/utils/api-client'

import TargetCommentTreeNode from './TargetCommentTreeNode'

export default {
  name: 'TargetCommentListModal',
  components: {
    TargetCommentTreeNode
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    target: {
      type: String,
      required: true,
      validator: value => {
        return ['post', 'sheet', 'journal'].indexOf(value) !== -1
      }
    },
    targetId: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    return {
      model: undefined,
      list: {
        data: [],
        loading: false,
        params: {
          page: 0,
          size: 10
        },
        total: 0
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
    },
    pagination() {
      return {
        page: this.list.params.page + 1,
        size: this.list.params.size,
        total: this.list.total
      }
    },
    title() {
      if (!this.model) return ''
      if (['post', 'sheet'].includes(this.target)) {
        return this.model.title
      }
      return this.model.createTime
    },
    description() {
      if (!this.model) return ''
      if (['post', 'sheet'].includes(this.target)) {
        return this.model.summary
      }
      return this.model.content
    }
  },
  watch: {
    modalVisible(value) {
      if (value) {
        this.handleGetTargetModal()
      }
    }
  },
  methods: {
    async handleGetTargetModal() {
      try {
        const { data } = await apiClient[this.target].get(this.targetId)
        this.model = data

        await this.handleGetComments()
      } catch (e) {
        this.$log.error('Failed to get target data', e)
      }
    },

    async handleGetComments() {
      try {
        this.list.loading = true

        const response = await apiClient.comment.listAsTreeView(`${this.target}s`, this.targetId, this.list.params)
        this.list.data = response.data.content
        this.list.total = response.data.total
      } catch (e) {
        this.$log.error('Failed to get target comments', e)
      } finally {
        this.list.loading = false
      }
    },

    /**
     * Handle page change
     */
    handlePageChange(page = 1) {
      this.list.params.page = page - 1
      this.handleGetComments()
    },

    /**
     * Handle page size change
     */
    handlePageSizeChange(current, size) {
      this.list.params.page = 0
      this.list.params.size = size
      this.handleGetComments()
    },

    onClose() {
      this.$emit('close')
    }
  }
}
</script>
