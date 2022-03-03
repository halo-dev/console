<template>
  <page-view>
    <PostListView
      ref="postListView"
      :columns="postColumns"
      :default-statuses="[postStatuses.PUBLISHED.value, postStatuses.DRAFT.value, postStatuses.INTIMATE.value]"
      @change:params="onChangeParams"
    >
      <template #operator-before>
        <router-link :to="{ name: 'PostWrite' }">
          <a-button icon="plus" type="primary">写文章</a-button>
        </router-link>
      </template>
      <template #operator-after>
        <a-button icon="delete" @click="recyclePostModalVisible = true"> 回收站</a-button>
      </template>
    </PostListView>
    <RecyclePostModal :visible.sync="recyclePostModalVisible" @close="onRecyclePostModalClose" />
  </page-view>
</template>

<script>
// components
import { PageView } from '@/layouts'
import PostListView from '@/components/Post/PostListView'
import RecyclePostModal from '@/components/Post/RecyclePostModal'

import { postColumns, postStatuses } from '@/core/constant'

export default {
  name: 'PostList',
  components: {
    PageView,
    PostListView,
    RecyclePostModal
  },
  data() {
    return { postStatuses, postColumns, recyclePostModalVisible: false }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const postListView = vm.$refs.postListView

      if (to.query.page) {
        postListView.list.params.page = Number(to.query.page)
      }

      if (to.query.size) {
        postListView.list.params.size = Number(to.query.size)
      }

      postListView.list.params.sort = to.query.sort
      postListView.list.params.keyword = to.query.keyword
      postListView.list.params.categoryId = to.query.categoryId
      postListView.list.params.status = to.query.status
      postListView.handleListPosts()
    })
  },
  methods: {
    onChangeParams(params) {
      const path = this.$router.history.current.path
      this.$router.replace({ path, query: params }).catch(err => err)
    },

    onRecyclePostModalClose() {
      this.$refs.postListView.handleListPosts()
    }
  }
}
</script>
