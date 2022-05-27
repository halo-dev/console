<template>
  <page-view>
    <PostListView
      ref="postListView"
      :default-statuses="[postStatuses.TO_BE_AUDIT.value]"
      :isAuditPage="true"
      :columns="auditPostsColumns"
      @change:params="onChangeParams"
    >
    </PostListView>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import PostListView from '@/components/Post/PostListView'
import { auditPostsColumns, postStatuses } from '@/core/constant'
import axios from 'axios'
export default {
  name: 'AuditPosts',
  components: {
    PageView,
    PostListView
  },
  data() {
    return {
      auditPostsColumns,
      postStatuses
    }
  },
  mounted() {
    const axiosConfig = {
      method: 'get',
      headers: {
        Authorization: window.localStorage.getItem('Access-Token'),
        'Content-Type': 'application/json'
      }
    }
    axios({
      url: '/api/admin/posts/page-to-be-audit?page=0&size=10&more=true',
      ...axiosConfig
    }).then(resp => {
      console.log(resp)
    })
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
    }
  }
}
</script>

<style scoped></style>
