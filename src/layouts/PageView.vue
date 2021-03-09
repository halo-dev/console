<template>
  <div :style="!hiddenHeaderContent ? 'margin: -24px -24px 0px;' : null">
    <a-affix v-if="affix">
      <div class="page-header" v-if="!hiddenHeaderContent">
        <div class="page-header-index-wide">
          <a-page-header :title="title" :sub-title="subTitle" :breadcrumb="{ props: { routes: breadList } }">
            <template #extra>
              <slot name="extra"> </slot>
            </template>
            <template #footer>
              <slot name="footer"> </slot>
            </template>
          </a-page-header>
        </div>
      </div>
    </a-affix>
    <div class="page-header" v-if="!hiddenHeaderContent && !affix">
      <div class="page-header-index-wide">
        <a-page-header :title="title" :sub-title="subTitle" :breadcrumb="{ props: { routes: breadList } }">
          <template #extra>
            <slot name="extra"> </slot>
          </template>
          <template #footer>
            <slot name="footer"> </slot>
          </template>
        </a-page-header>
      </div>
    </div>
    <div class="content">
      <div class="page-header-index-wide">
        <slot>
          <router-view ref="content" />
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  props: {
    title: {
      type: String,
      default: null
    },
    subTitle: {
      type: String,
      default: null
    },
    affix: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const route = useRoute()

    console.log('route:', route)

    let breadList = reactive([])

    const hiddenHeaderContent = route.meta.hiddenHeaderContent

    const handleGetBreadcrumb = () => {
      breadList = []
      route.matched.forEach(item => {
        item.breadcrumbName = item.meta.title
        breadList.push(item)
      })
    }
    handleGetBreadcrumb()

    watch(route, () => {
      handleGetBreadcrumb()
    })

    console.log('breadList:', breadList)

    return {
      props,
      breadList,
      hiddenHeaderContent
    }
  }
})
</script>

<style lang="less" scoped>
.page-header {
  background: #fff;
  padding: 0 24px 0;
  border-bottom: 1px solid #e8e8e8;
  .ant-page-header {
    padding: 16px 0px;
  }
}

.mobile .page-header,
.tablet .page-header {
  padding: 0 !important;
  .ant-page-header {
    padding: 16px;
  }
}

.content {
  margin: 24px 24px 0;
  .link {
    margin-top: 16px;
    &:not(:empty) {
      margin-bottom: 16px;
    }
    a {
      margin-right: 32px;
      height: 24px;
      line-height: 24px;
      display: inline-block;
      i {
        font-size: 24px;
        margin-right: 8px;
        vertical-align: middle;
      }
      span {
        height: 24px;
        line-height: 24px;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
</style>
