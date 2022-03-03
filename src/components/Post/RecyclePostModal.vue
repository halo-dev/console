<template>
  <a-modal
    v-model="modalVisible"
    :afterClose="onClose"
    :bodyStyle="{ padding: '8px' }"
    :width="1080"
    destroyOnClose
    title="回收站"
  >
    <PostListView
      ref="postListView"
      :columns="recyclePostColumns"
      :default-page-size="5"
      :default-statuses="[postStatuses.RECYCLE.value]"
      :searchWrapper="false"
    >
      <template #operator-after>
        <a-button icon="delete" type="danger" @click="handleDeleteCurrentPage">删除当前页</a-button>
      </template>
    </PostListView>
    <template #footer>
      <a-button @click="modalVisible = false">关闭</a-button>
    </template>
  </a-modal>
</template>
<script>
import PostListView from './PostListView'
import { postStatuses, recyclePostColumns } from '@/core/constant'

export default {
  name: 'RecyclePostModal',
  components: {
    PostListView
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      postStatuses,
      recyclePostColumns
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
        this.$nextTick(() => {
          this.$refs.postListView.handleListPosts()
        })
      }
    }
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    handleDeleteCurrentPage() {
      this.$refs.postListView.handleDeleteCurrentPage()
    }
  }
}
</script>
