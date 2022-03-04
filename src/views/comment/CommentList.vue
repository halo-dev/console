<template>
  <page-view>
    <div class="card-container">
      <a-tabs type="card">
        <a-tab-pane key="post" tab="文章">
          <comment-tab target="post"></comment-tab>
        </a-tab-pane>
        <a-tab-pane key="sheet" tab="页面">
          <comment-tab target="sheet"></comment-tab>
        </a-tab-pane>
        <a-tab-pane key="journal" tab="日志">
          <comment-tab target="journal"></comment-tab>
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
  }
}
</script>
