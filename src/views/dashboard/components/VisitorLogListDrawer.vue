<template>
  <div>
    <a-drawer
      title="访问日志"
      :width="isMobile()?'100%':'480'"
      closable
      :visible="visible"
      destroyOnClose
      @close="onClose"
    >
      <a-row
        type="flex"
        align="middle"
      >
        <a-col :span="24">
          <a-skeleton
            active
            :loading="loading"
            :paragraph="{rows: 10}"
          >
            <a-list :dataSource="formattedLogsDatas">
              <a-list-item
                slot="renderItem"
                slot-scope="item, index"
                :key="index"
              >
                <a-list-item-meta :description="item.updateTime | timeAgo">
                  <span slot="title">IP地址：{{ item.ipAddress }}</span>
                </a-list-item-meta>
                <ellipsis
                  :length="35"
                  tooltip
                >
                  位置：{{ item.region }}
                </ellipsis>
              </a-list-item>
            </a-list>
          </a-skeleton>

          <div class="page-wrapper">
            <a-pagination
              class="pagination"
              :current="pagination.page"
              :total="pagination.total"
              :defaultPageSize="pagination.size"
              :pageSizeOptions="['5','10','20']"
              showSizeChanger
              @showSizeChange="handlePaginationChange"
              @change="handlePaginationChange"
            />
          </div>
        </a-col>
      </a-row>
      <a-divider class="divider-transparent" />
      <div class="bottom-control">
        <a-button
          type="primary"
          @click="loadVisitorLogs"
          :loading="loading"
        >刷新</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { mixin, mixinDevice } from '@/utils/mixin.js'
import visitLogApi from '@/api/visitorLog'
export default {
  name: 'VisitorLogListDrawer',
  mixins: [mixin, mixinDevice],
  data() {
    return {
      loading: true,
      visitorLogs: [],
      pagination: {
        page: 1,
        size: 5,
        sort: null,
        total: 1
      },
      visitorLogQueryParam: {
        page: 0,
        size: 5,
        sort: null
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    formattedLogsDatas() {
      return this.visitorLogs.map(visitorLog => {
        visitorLog.region = visitorLog.country + visitorLog.province + visitorLog.city + visitorLog.isp
        return visitorLog
      })
    }
  },
  watch: {
    visible: function(newValue, oldValue) {
      if (newValue) {
        this.loadSkeleton()
        this.loadVisitorLogs()
      }
    }
  },
  methods: {
    loadSkeleton() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    loadVisitorLogs() {
      this.loading = true
      this.visitorLogQueryParam.page = this.pagination.page - 1
      this.visitorLogQueryParam.size = this.pagination.size
      this.visitorLogQueryParam.sort = this.pagination.sort
      visitLogApi.pageBy(this.visitorLogQueryParam).then(response => {
        this.visitorLogs = response.data.data.content
        this.pagination.total = response.data.data.total
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    },
    handlePaginationChange(page, pageSize) {
      this.$log.debug(`Current: ${page}, PageSize: ${pageSize}`)
      this.pagination.page = page
      this.pagination.size = pageSize
      this.loadVisitorLogs()
    },
    onClose() {
      this.$emit('close', false)
    }
  }
}
</script>
