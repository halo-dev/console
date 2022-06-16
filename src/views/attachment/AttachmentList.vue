<template>
  <page-view>
    <a-row :gutter="12" align="middle" type="flex">
      <a-col :span="24" class="pb-3">
        <a-card :bodyStyle="{ padding: '16px' }" :bordered="false">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="6" :sm="24">
                  <a-form-item label="关键词：">
                    <a-input v-model="list.params.keyword" @keyup.enter="handleQuery()" />
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="存储位置：">
                    <a-select
                      v-model="list.params.attachmentType"
                      :loading="types.loading"
                      allowClear
                      @change="handleQuery()"
                    >
                      <a-select-option v-for="item in types.data" :key="item" :value="item">
                        {{ item | typeText }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="文件类型：">
                    <a-select
                      v-model="list.params.mediaType"
                      :loading="mediaTypes.loading"
                      allowClear
                      @change="handleQuery()"
                    >
                      <a-select-option v-for="(item, index) in mediaTypes.data" :key="index" :value="item"
                        >{{ item }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <span class="table-page-search-submitButtons">
                    <a-space>
                      <a-button type="primary" @click="handleQuery()">查询</a-button>
                      <a-button @click="handleResetParam()">重置</a-button>
                    </a-space>
                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <div class="table-operator mb-0">
            <a-button icon="cloud-upload" type="primary" @click="upload.visible = true">上传</a-button>
            <a-button v-show="list.selected.length" icon="check-circle" type="primary" @click="handleSelectAll">
              全选
            </a-button>
            <a-button v-show="list.selected.length" icon="delete" type="danger" @click="handleDeleteAttachmentInBatch">
              删除
            </a-button>
            <a-button v-show="list.selected.length" icon="close" @click="list.selected = []"> 取消</a-button>
          </div>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-spin :spinning="list.loading">
          <div
            class="grid grid-cols-2 gap-x-2 gap-y-3 sm:grid-cols-3 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10"
            role="list"
          >
            <div
              v-for="(attachment, index) in list.data"
              :key="index"
              :class="`${isItemSelect(attachment) ? 'border-blue-600' : 'border-white'}`"
              class="relative cursor-pointer overflow-hidden rounded-sm border-solid bg-white transition-all hover:shadow-sm"
              @click="handleItemClick(attachment)"
              @mouseenter="$set(attachment, 'hover', true)"
              @mouseleave="$set(attachment, 'hover', false)"
              @contextmenu.prevent="handleContextMenu($event, attachment)"
            >
              <div class="group aspect-w-10 aspect-h-7 block w-full overflow-hidden bg-white">
                <img
                  v-if="isImage(attachment)"
                  :alt="attachment.name"
                  :src="attachment.thumbPath"
                  class="pointer-events-none overflow-hidden object-cover transition-opacity group-hover:opacity-70"
                  loading="lazy"
                />
                <span v-else class="flex items-center justify-center text-2xl text-gray-600">
                  {{ attachment.suffix }}
                </span>
              </div>
              <a-tooltip :title="attachment.name">
                <span class="block truncate p-1.5 text-xs font-medium text-gray-500">
                  {{ attachment.name }}
                </span>
              </a-tooltip>

              <a-icon
                v-show="!isItemSelect(attachment) && attachment.hover"
                :style="{ fontSize: '20px', color: 'rgb(37 99 235)' }"
                class="absolute top-1 right-1 cursor-pointer font-bold transition-all"
                theme="twoTone"
                type="plus-circle"
                @click.stop="handleSelect(attachment)"
              />
              <a-icon
                v-show="isItemSelect(attachment)"
                :style="{ fontSize: '20px', color: 'rgb(37 99 235)' }"
                class="absolute top-1 right-1 cursor-pointer font-bold transition-all"
                theme="twoTone"
                type="check-circle"
              />
              <a-icon
                v-show="attachment.hover && list.selected.length > 0"
                :style="{ fontSize: '20px' }"
                class="absolute top-1 left-1 cursor-pointer font-bold transition-all"
                theme="twoTone"
                type="profile"
                @click.stop="handleOpenDetail(attachment)"
              />
            </div>
          </div>
        </a-spin>
      </a-col>
    </a-row>

    <div class="page-wrapper">
      <a-pagination
        :current="pagination.page"
        :defaultPageSize="pagination.size"
        :pageSizeOptions="['50', '100', '150', '200']"
        :total="pagination.total"
        class="pagination"
        showLessItems
        showSizeChanger
        @change="handlePageChange"
        @showSizeChange="handlePageSizeChange"
      />
    </div>

    <AttachmentUploadModal :visible.sync="upload.visible" @close="onUploadClose" />

    <AttachmentDetailModal
      :addToPhoto="true"
      :attachment="list.current"
      :visible.sync="detailVisible"
      @delete="handleListAttachments()"
    >
      <template #extraFooter>
        <a-button :disabled="selectPreviousButtonDisabled" @click="handleSelectPrevious">上一项</a-button>
        <a-button :disabled="selectNextButtonDisabled" @click="handleSelectNext">下一项</a-button>
      </template>
    </AttachmentDetailModal>
  </page-view>
</template>

<script>
import { mixin, mixinDevice } from '@/mixins/mixin.js'
import { PageView } from '@/layouts'
import apiClient from '@/utils/api-client'
import { attachmentTypes } from '@/core/constant'

export default {
  components: {
    PageView
  },
  mixins: [mixin, mixinDevice],
  filters: {
    typeText(type) {
      return attachmentTypes[type].text
    }
  },
  data() {
    return {
      list: {
        data: [],
        loading: false,
        total: 0,
        hasNext: false,
        hasPrevious: false,
        params: {
          page: 0,
          size: 50,
          keyword: undefined,
          mediaType: undefined,
          attachmentType: undefined
        },
        selected: [],
        current: {}
      },

      mediaTypes: {
        data: [],
        loading: false
      },

      types: {
        data: [],
        loading: false
      },

      upload: {
        visible: false
      },

      detailVisible: false
    }
  },
  computed: {
    isImage() {
      return function (attachment) {
        if (!attachment || !attachment.mediaType) {
          return false
        }
        return attachment.mediaType.startsWith('image')
      }
    },
    isItemSelect() {
      return function (attachment) {
        return this.list.selected.findIndex(item => item.id === attachment.id) > -1
      }
    },
    pagination() {
      return {
        page: this.list.params.page + 1,
        size: this.list.params.size,
        total: this.list.total
      }
    },
    selectPreviousButtonDisabled() {
      const index = this.list.data.findIndex(attachment => attachment.id === this.list.current.id)
      return index === 0 && !this.list.hasPrevious
    },
    selectNextButtonDisabled() {
      const index = this.list.data.findIndex(attachment => attachment.id === this.list.current.id)
      return index === this.list.data.length - 1 && !this.list.hasNext
    }
  },
  created() {
    this.handleListAttachments()
    this.handleListMediaTypes()
    this.handleListTypes()
  },
  methods: {
    /**
     * List attachments
     */
    async handleListAttachments() {
      try {
        this.list.loading = true

        const response = await apiClient.attachment.list(this.list.params)

        if (response.data.content.length === 0 && this.list.params.page > 0) {
          this.list.params.page--
          await this.handleListAttachments()
          return
        }
        this.list.data = response.data.content
        this.list.total = response.data.total
        this.list.hasNext = response.data.hasNext
        this.list.hasPrevious = response.data.hasPrevious
      } catch (error) {
        this.$log.error(error)
      } finally {
        this.list.loading = false
      }
    },

    /**
     * List attachment media types
     */
    async handleListMediaTypes() {
      try {
        this.mediaTypes.loading = true

        const response = await apiClient.attachment.listMediaTypes()

        this.mediaTypes.data = response.data
      } catch (error) {
        this.$log.error(error)
      } finally {
        this.mediaTypes.loading = false
      }
    },

    /**
     * List attachment upload types
     */
    async handleListTypes() {
      try {
        this.types.loading = true

        const response = await apiClient.attachment.listTypes()

        this.types.data = response.data
      } catch (error) {
        this.$log.error(error)
      } finally {
        this.types.loading = false
      }
    },

    /**
     * Handle open attachment detail modal event
     */
    handleOpenDetail(attachment) {
      this.list.current = attachment
      this.detailVisible = true
    },

    handleItemClick(attachment) {
      if (this.list.selected.length <= 0) {
        this.handleOpenDetail(attachment)
        return
      }
      this.isItemSelect(attachment) ? this.handleUnselect(attachment) : this.handleSelect(attachment)
    },

    handleSelect(attachment) {
      this.list.selected = [...this.list.selected, attachment]
    },

    handleUnselect(attachment) {
      this.list.selected = this.list.selected.filter(item => item.id !== attachment.id)
    },

    handleSelectAll() {
      this.list.selected = this.list.data
    },

    /**
     * Show context menu
     */
    handleContextMenu(event, item) {
      this.$contextmenu({
        items: [
          {
            label: `复制${this.isImage(item) ? '图片' : '文件'}链接`,
            onClick: () => {
              const text = `${encodeURI(item.path)}`
              this.$copyText(text)
                .then(message => {
                  this.$log.debug('copy', message)
                  this.$message.success('复制成功！')
                })
                .catch(err => {
                  this.$log.debug('copy.err', err)
                  this.$message.error('复制失败！')
                })
            },
            divided: true
          },
          {
            disabled: !this.isImage(item),
            label: '复制 Markdown 格式链接',
            onClick: () => {
              const text = `![${item.name}](${encodeURI(item.path)})`
              this.$copyText(text)
                .then(message => {
                  this.$log.debug('copy', message)
                  this.$message.success('复制成功！')
                })
                .catch(err => {
                  this.$log.debug('copy.err', err)
                  this.$message.error('复制失败！')
                })
            },
            divided: true
          },
          {
            label: '删除',
            onClick: () => {
              this.$confirm({
                title: '提示',
                content: '确定删除该附件？',
                okText: '确定',
                cancelText: '取消',
                onOk: async () => {
                  await apiClient.attachment.delete(item.id)
                  await this.handleListAttachments()
                  this.handleUnselect(item)
                }
              })
            }
          }
        ],
        event,
        minWidth: 210
      })
      return false
    },

    /**
     * Handle page change
     */
    handlePageChange(page = 1) {
      this.list.params.page = page - 1
      this.handleListAttachments()
    },

    /**
     * Handle page size change
     */
    handlePageSizeChange(current, size) {
      this.$log.debug(`Current: ${current}, PageSize: ${size}`)
      this.list.params.page = 0
      this.list.params.size = size
      this.handleListAttachments()
    },

    /**
     * Reset query params
     */
    handleResetParam() {
      this.list.params.keyword = undefined
      this.list.params.mediaType = undefined
      this.list.params.attachmentType = undefined
      this.handlePageChange()
      this.handleListMediaTypes()
      this.handleListTypes()
    },

    /**
     * Search attachments
     */
    handleQuery() {
      this.handlePageChange()
    },

    onUploadClose() {
      this.handlePageChange()
      this.handleListMediaTypes()
      this.handleListTypes()
    },

    /**
     * Deletes selected attachments
     */
    handleDeleteAttachmentInBatch() {
      const _this = this
      if (this.list.selected.length <= 0) {
        this.$message.warn('你还未选择任何附件，请至少选择一个！')
        return
      }
      this.$confirm({
        title: '确定要批量删除选中的附件吗？',
        content: '一旦删除不可恢复，请谨慎操作',
        async onOk() {
          try {
            const attachmentIds = _this.list.selected.map(attachment => attachment.id)
            await apiClient.attachment.deleteInBatch(attachmentIds)
            _this.list.selected = []
            _this.$message.success('删除成功')
          } catch (e) {
            _this.$log.error('Failed to delete selected attachments', e)
          } finally {
            await _this.handleListAttachments()
          }
        }
      })
    },

    /**
     * Select previous attachment
     */
    async handleSelectPrevious() {
      const index = this.list.data.findIndex(item => item.id === this.list.current.id)
      if (index > 0) {
        this.list.current = this.list.data[index - 1]
        return
      }
      if (index === 0 && this.list.hasPrevious) {
        this.list.params.page--
        await this.handleListAttachments()

        this.list.current = this.list.data[this.list.data.length - 1]
      }
    },

    /**
     * Select next attachment
     */
    async handleSelectNext() {
      const index = this.list.data.findIndex(item => item.id === this.list.current.id)
      if (index < this.list.data.length - 1) {
        this.list.current = this.list.data[index + 1]
        return
      }
      if (index === this.list.data.length - 1 && this.list.hasNext) {
        this.list.params.page++
        await this.handleListAttachments()

        this.list.current = this.list.data[0]
      }
    }
  }
}
</script>
