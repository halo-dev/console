<template>
  <div>
    <!-- Mobile -->
    <a-list
      v-if="isMobile()"
      :dataSource="list.data"
      :loading="list.loading"
      :pagination="false"
      itemLayout="vertical"
      size="large"
    >
      <template #renderItem="item, index">
        <a-list-item :key="index">
          <template #actions>
            <span>
              <a-icon type="eye" />
              {{ item.visits }}
            </span>
            <span @click="handleOpenSheetComments(item)">
              <a-icon type="message" />
              {{ item.commentCount }}
            </span>
            <a-dropdown :trigger="['click']" placement="topLeft">
              <span>
                <a-icon type="bars" />
              </span>
              <template #overlay>
                <a-menu>
                  <a-menu-item
                    v-if="item.status === 'PUBLISHED' || item.status === 'DRAFT'"
                    @click="handleEditClick(item)"
                  >
                    编辑
                  </a-menu-item>
                  <a-menu-item v-else-if="item.status === 'RECYCLE'">
                    <a-popconfirm
                      :title="'你确定要发布【' + item.title + '】页面？'"
                      cancelText="取消"
                      okText="确定"
                      @confirm="handleChangeStatus(item.id, 'PUBLISHED')"
                    >
                      还原
                    </a-popconfirm>
                  </a-menu-item>
                  <a-menu-item v-if="item.status === 'PUBLISHED' || item.status === 'DRAFT'">
                    <a-popconfirm
                      :title="'你确定要删除【' + item.title + '】页面？'"
                      cancelText="取消"
                      okText="确定"
                      @confirm="handleChangeStatus(item.id, 'RECYCLE')"
                    >
                      删除
                    </a-popconfirm>
                  </a-menu-item>
                  <a-menu-item v-else-if="item.status === 'RECYCLE'">
                    <a-popconfirm
                      :title="'你确定要永久删除【' + item.title + '】页面？'"
                      cancelText="取消"
                      okText="确定"
                      @confirm="handleDelete(item.id)"
                    >
                      永久删除
                    </a-popconfirm>
                  </a-menu-item>
                  <a-menu-item @click="handleOpenSheetSettings(item)">设置</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <template #extra>
            <a-badge :status="sheetStatuses[item.status].status" :text="item.status | statusText" />
          </template>
          <a-list-item-meta>
            <template #description>
              {{ item.createTime | moment }}
            </template>
            <template #title>
              <div
                style="max-width: 300px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
              >
                <a-tooltip v-if="item.inProgress" placement="top" title="当前有内容已保存，但还未发布。">
                  <a-icon
                    class="cursor-pointer"
                    style="margin-right: 3px"
                    theme="twoTone"
                    twoToneColor="#52c41a"
                    type="info-circle"
                    @click="handleEditClick(item)"
                  />
                </a-tooltip>

                <a-tooltip v-if="item.status === 'PUBLISHED'" :title="'点击访问【' + item.title + '】'" placement="top">
                  <a :href="item.fullPath" class="no-underline" target="_blank">
                    {{ item.title }}
                  </a>
                </a-tooltip>

                <a-tooltip
                  v-else-if="item.status === 'DRAFT'"
                  :title="'点击预览【' + item.title + '】'"
                  placement="top"
                >
                  <a class="no-underline" href="javascript:void(0);" @click="handlePreview(item.id)">
                    {{ item.title }}
                  </a>
                </a-tooltip>

                <a v-else class="no-underline" href="javascript:void(0);" disabled>
                  {{ item.title }}
                </a>
              </div>
            </template>
          </a-list-item-meta>
          <div v-if="item.summary" class="block">
            <span> {{ item.summary }}... </span>
          </div>
        </a-list-item>
      </template>
    </a-list>

    <!-- Desktop -->
    <a-table
      v-else
      :columns="customColumns"
      :dataSource="list.data"
      :loading="list.loading"
      :pagination="false"
      :rowKey="sheet => sheet.id"
      :scrollToFirstRowOnChange="true"
    >
      <template #sheetTitle="text, record">
        <a-tooltip v-if="record.inProgress" placement="top" title="当前有内容已保存，但还未发布。">
          <a-icon
            class="cursor-pointer"
            style="margin-right: 3px"
            theme="twoTone"
            twoToneColor="#52c41a"
            type="info-circle"
            @click="handleEditClick(record)"
          />
        </a-tooltip>
        <a-tooltip v-if="record.status === 'PUBLISHED'" :title="'点击访问【' + text + '】'" placement="top">
          <a :href="record.fullPath" class="no-underline" target="_blank">
            {{ text }}
          </a>
        </a-tooltip>

        <a-tooltip v-else-if="record.status === 'DRAFT'" :title="'点击预览【' + text + '】'" placement="top">
          <a class="no-underline" href="javascript:void(0);" @click="handlePreview(record.id)">
            {{ text }}
          </a>
        </a-tooltip>

        <a v-else class="no-underline" href="javascript:void(0);" disabled>
          {{ text }}
        </a>
      </template>

      <template #status="status">
        <a-badge :status="sheetStatuses[status].status" :text="status | statusText" />
      </template>

      <template #commentCount="text, record">
        <a-badge
          :count="record.commentCount"
          :numberStyle="{ backgroundColor: '#f38181' }"
          :overflowCount="999"
          :showZero="true"
          class="cursor-pointer"
          @click="handleOpenSheetComments(record)"
        />
      </template>

      <template #visits="visits">
        <a-badge :count="visits" :numberStyle="{ backgroundColor: '#00e0ff' }" :overflowCount="9999" :showZero="true" />
      </template>

      <template #createTime="createTime">
        <a-tooltip placement="top">
          <template #title>
            {{ createTime | moment }}
          </template>
          {{ createTime | timeAgo }}
        </a-tooltip>
      </template>

      <template #action="text, sheet">
        <a-button
          v-if="sheet.status === 'PUBLISHED' || sheet.status === 'DRAFT'"
          class="!p-0"
          type="link"
          @click="handleEditClick(sheet)"
        >
          编辑
        </a-button>

        <a-popconfirm
          v-else-if="sheet.status === 'RECYCLE'"
          :title="'你确定要发布【' + sheet.title + '】？'"
          cancelText="取消"
          okText="确定"
          @confirm="handleChangeStatus(sheet.id, 'PUBLISHED')"
        >
          <a-button class="!p-0" type="link">还原</a-button>
        </a-popconfirm>

        <a-divider type="vertical" />

        <a-popconfirm
          v-if="sheet.status === 'PUBLISHED' || sheet.status === 'DRAFT'"
          :title="'你确定要删除【' + sheet.title + '】页面？'"
          cancelText="取消"
          okText="确定"
          @confirm="handleChangeStatus(sheet.id, 'RECYCLE')"
        >
          <a-button class="!p-0" type="link">删除</a-button>
        </a-popconfirm>

        <a-popconfirm
          v-else-if="sheet.status === 'RECYCLE'"
          :title="'你确定要永久删除【' + sheet.title + '】页面？'"
          cancelText="取消"
          okText="确定"
          @confirm="handleDelete(sheet.id)"
        >
          <a-button class="!p-0" type="link">永久删除</a-button>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a-button class="!p-0" type="link" @click="handleOpenSheetSettings(sheet)">设置</a-button>
      </template>
    </a-table>
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
    <SheetSettingModal
      :loading="sheetSettingLoading"
      :savedCallback="onSheetSavedCallback"
      :sheet="list.selected"
      :visible.sync="sheetSettingVisible"
      @onClose="list.selected = {}"
    >
      <template #extraFooter>
        <a-button :disabled="selectPreviousButtonDisabled" @click="handleSelectPrevious"> 上一篇</a-button>
        <a-button :disabled="selectNextButtonDisabled" @click="handleSelectNext"> 下一篇</a-button>
      </template>
    </SheetSettingModal>
    <TargetCommentListModal
      :target-id="list.selected.id"
      :title="`「${list.selected.title}」的评论`"
      :visible.sync="sheetCommentVisible"
      target="sheet"
      @close="onSheetCommentsClose"
    >
      <template #extraFooter>
        <a-button :disabled="selectPreviousButtonDisabled" @click="handleSelectPrevious"> 上一篇</a-button>
        <a-button :disabled="selectNextButtonDisabled" @click="handleSelectNext"> 下一篇</a-button>
      </template>
    </TargetCommentListModal>
  </div>
</template>
<script>
// components
import SheetSettingModal from './SheetSettingModal'
import TargetCommentListModal from '@/components/Comment/TargetCommentListModal'

import { mixin, mixinDevice } from '@/mixins/mixin.js'
import apiClient from '@/utils/api-client'
import { sheetStatuses } from '@/core/constant'

const customColumns = [
  {
    title: '标题',
    dataIndex: 'title',
    ellipsis: true,
    scopedSlots: { customRender: 'sheetTitle' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '评论量',
    dataIndex: 'commentCount',
    scopedSlots: { customRender: 'commentCount' }
  },
  {
    title: '访问量',
    dataIndex: 'visits',
    scopedSlots: { customRender: 'visits' }
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime' }
  },
  {
    title: '操作',
    width: '200px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'CustomSheetList',
  mixins: [mixin, mixinDevice],
  components: {
    SheetSettingModal,
    TargetCommentListModal
  },
  data() {
    return {
      customColumns,
      sheetStatuses,

      list: {
        data: [],
        loading: false,
        total: 0,
        hasPrevious: false,
        hasNext: false,
        params: {
          page: 0,
          size: 10
        },
        selected: {}
      },

      sheetSettingVisible: false,
      sheetSettingLoading: false,
      sheetCommentVisible: false
    }
  },
  computed: {
    pagination() {
      return {
        page: this.list.params.page + 1,
        size: this.list.params.size,
        total: this.list.total
      }
    },
    selectPreviousButtonDisabled() {
      const index = this.list.data.findIndex(sheet => sheet.id === this.list.selected.id)
      return index === 0 && !this.list.hasPrevious
    },
    selectNextButtonDisabled() {
      const index = this.list.data.findIndex(sheet => sheet.id === this.list.selected.id)
      return index === this.list.data.length - 1 && !this.list.hasNext
    }
  },
  created() {
    this.handleListSheets()
  },
  methods: {
    async handleListSheets(enableLoading = true) {
      try {
        if (enableLoading) {
          this.list.loading = true
        }

        const { data } = await apiClient.sheet.list(this.list.params)

        this.list.data = data.content
        this.list.total = data.total
        this.list.hasPrevious = data.hasPrevious
        this.list.hasNext = data.hasNext
      } catch (e) {
        this.$log.error(e)
      } finally {
        this.list.loading = false
      }
    },

    handleEditClick(sheet) {
      this.$router.push({ name: 'SheetEdit', query: { sheetId: sheet.id } })
    },

    async handleChangeStatus(sheetId, status) {
      try {
        await apiClient.sheet.updateStatusById(sheetId, status)
        this.$message.success('操作成功！')
      } catch (e) {
        this.$log.error('Failed to change sheet status', e)
      } finally {
        await this.handleListSheets()
      }
    },

    async handleDelete(sheetId) {
      try {
        await apiClient.sheet.delete(sheetId)
        this.$message.success('删除成功！')
      } catch (e) {
        this.$log.error('Failed to delete sheet', e)
      } finally {
        await this.handleListSheets()
      }
    },

    async handleOpenSheetSettings(sheet) {
      try {
        this.sheetSettingVisible = true
        this.sheetSettingLoading = true

        const { data } = await apiClient.sheet.get(sheet.id)
        this.list.selected = data
      } catch (e) {
        this.$log.error('Failed to open sheet settings', e)
      } finally {
        this.sheetSettingLoading = false
      }
    },

    handleOpenSheetComments(sheet) {
      this.list.selected = sheet
      this.sheetCommentVisible = true
    },

    handlePreview(sheetId) {
      apiClient.sheet.getPreviewLinkById(sheetId).then(response => {
        window.open(response, '_blank')
      })
    },

    /**
     * Handle page change
     */
    handlePageChange(page = 1) {
      this.list.params.page = page - 1
      this.handleListSheets()
    },

    /**
     * Handle page size change
     */
    handlePageSizeChange(current, size) {
      this.$log.debug(`Current: ${current}, PageSize: ${size}`)
      this.list.params.page = 0
      this.list.params.size = size
      this.handleListSheets()
    },

    onSheetCommentsClose() {
      this.sheetCommentVisible = false
      this.list.selected = {}
      this.handleListSheets(false)
    },

    onSheetSavedCallback() {
      this.handleListSheets(false)
    },

    /**
     * Select previous sheet
     */
    async handleSelectPrevious() {
      const index = this.list.data.findIndex(post => post.id === this.list.selected.id)
      if (index > 0) {
        this.sheetSettingLoading = true
        const response = await apiClient.sheet.get(this.list.data[index - 1].id)
        this.list.selected = response.data
        this.sheetSettingLoading = false
        return
      }
      if (index === 0 && this.list.hasPrevious) {
        this.list.params.page--
        await this.handleListPosts()
        this.sheetSettingLoading = true
        const response = await apiClient.sheet.get(this.list.data[this.list.data.length - 1].id)
        this.list.selected = response.data
        this.sheetSettingLoading = false
      }
    },

    /**
     * Select next sheet
     */
    async handleSelectNext() {
      const index = this.list.data.findIndex(post => post.id === this.list.selected.id)
      if (index < this.list.data.length - 1) {
        this.sheetSettingLoading = true
        const response = await apiClient.sheet.get(this.list.data[index + 1].id)
        this.list.selected = response.data
        this.sheetSettingLoading = false
        return
      }
      if (index === this.list.data.length - 1 && this.list.hasNext) {
        this.list.params.page++
        await this.handleListPosts()
        this.sheetSettingLoading = true
        const response = await apiClient.sheet.get(this.list.data[0].id)
        this.list.selected = response.data
        this.sheetSettingLoading = false
      }
    }
  },
  filters: {
    statusText(type) {
      return type ? sheetStatuses[type].text : ''
    }
  }
}
</script>
