<template>
  <page-view>
    <div class="card-container">
      <a-tabs v-model="activeKey" type="card">
        <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title">
          <comment-tab :target="pane.key" :defaultStatus="defaultStatus"></comment-tab>
        </a-tab-pane>
      </a-tabs>
    </div>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import CommentTab from './components/CommentTab'

export default {
  components: {
    PageView,
    CommentTab
  },
  data() {
    const panes = [
      { title: '文章', key: 'post' },
      { title: '页面', key: 'sheet' },
      { title: '日志', key: 'journal' }
    ]
    return {
      panes,
      activeKey: panes[0].key,
      defaultStatus: undefined
    }
  },
  beforeRouteEnter(to, from, next) {
    // Get post id from query
    const activeKey = to.query.activeKey
    const defaultStatus = to.query.defaultStatus
    next(vm => {
      if (activeKey) {
        vm.activeKey = activeKey
      }
      if (defaultStatus) {
        vm.defaultStatus = defaultStatus
      }
    })
  },
  watch: {
    activeKey(newVal) {
      const path = this.$router.history.current.path
      this.$router.push({ path, query: { activeKey: newVal } }).catch(err => err)
    }
  }
}
</script>
