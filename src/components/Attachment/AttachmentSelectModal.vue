<template>
  <a-modal v-model="modalVisible" :afterClose="onAfterClose" :title="title" :width="1280" destroyOnClose>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="24">
            <a-form-item label="关键词：">
              <a-input v-model="list.params.keyword" @keyup.enter="handleSearch()" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="存储位置：">
              <a-select
                v-model="list.params.attachmentType"
                :loading="types.loading"
                allowClear
                @change="handleSearch()"
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
                @change="handleSearch()"
              >
                <a-select-option v-for="(item, index) in mediaTypes.data" :key="index" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-space>
                <a-button type="primary" @click="handleSearch()">查询</a-button>
                <a-button @click="handleResetParam(), handleListAttachments()">重置</a-button>
              </a-space>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator mb-0">
      <a-button icon="cloud-upload" type="primary" @click="upload.visible = true">上传</a-button>
    </div>

    <a-divider />

    <a-spin :spinning="list.loading">
      <div
        class="grid grid-cols-2 gap-x-2 gap-y-3 sm:grid-cols-3 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10"
        role="list"
      >
        <div
          v-for="(attachment, index) in list.data"
          :key="index"
          :class="`${isItemSelect(attachment) ? 'border-blue-600' : 'border-slate-200'}`"
          class="relative cursor-pointer overflow-hidden rounded-sm border-solid bg-white transition-all hover:shadow-sm"
          @click="handleItemClick(attachment)"
          @mouseenter="$set(attachment, 'hover', true)"
          @mouseleave="$set(attachment, 'hover', false)"
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
            v-show="isItemSelect(attachment) && !attachment.hover"
            :style="{ fontSize: '20px', color: 'rgb(37 99 235)' }"
            class="absolute top-1 right-1 cursor-pointer font-bold transition-all"
            theme="twoTone"
            type="check-circle"
          />
          <a-icon
            v-show="attachment.hover"
            :style="{ fontSize: '20px' }"
            class="absolute top-1 right-1 cursor-pointer font-bold transition-all"
            theme="twoTone"
            type="profile"
            @click.stop="handleOpenDetail(attachment)"
          />
        </div>
      </div>
    </a-spin>

    <div class="mt-4 flex justify-between">
      <a-popover placement="right" title="预览" trigger="click">
        <template slot="content">
          <a-tabs v-if="list.selected.length" default-active-key="markdown" tab-position="left">
            <a-tab-pane key="markdown" tab="Markdown">
              <div class="text-slate-400" v-html="markdownSyntaxList.join('<br />')"></div>
            </a-tab-pane>
            <a-tab-pane key="html" force-render tab="HTML">
              <div class="text-slate-400">
                <span v-for="(item, index) in htmlSyntaxList" :key="index" class="text-slate-400">
                  {{ item }}<br />
                </span>
              </div>
            </a-tab-pane>
          </a-tabs>
          <div v-else class="text-slate-400">未选择附件</div>
        </template>
        <a-tooltip placement="top" title="点击预览">
          <div class="cursor-pointer select-none self-center text-slate-400 transition-all hover:text-blue-400">
            已选择 {{ list.selected.length }} 项
          </div>
        </a-tooltip>
      </a-popover>

      <div class="page-wrapper flex justify-end self-center">
        <a-pagination
          :current="pagination.page"
          :defaultPageSize="pagination.size"
          :pageSizeOptions="['40', '50', '100', '150', '200']"
          :total="pagination.total"
          class="pagination !mt-0"
          showLessItems
          showSizeChanger
          @change="handlePageChange"
          @showSizeChange="handlePageSizeChange"
        />
      </div>
    </div>

    <template #footer>
      <a-button @click="modalVisible = false">取消</a-button>
      <a-button :disabled="!list.selected.length" type="primary" @click="handleConfirm">确定</a-button>
    </template>

    <AttachmentUploadModal :visible.sync="upload.visible" @close="handleSearch" />

    <AttachmentDetailModal :attachment="list.current" :visible.sync="detailVisible" @delete="handleListAttachments()">
      <template #extraFooter>
        <a-button :disabled="selectPreviousButtonDisabled" @click="handleSelectPrevious">上一项</a-button>
        <a-button :disabled="selectNextButtonDisabled" @click="handleSelectNext">下一项</a-button>
        <a-button type="primary" @click="handleItemClick(list.current)">
          {{ list.selected.findIndex(item => item.id === list.current.id) > -1 ? '取消选择' : '选择' }}
        </a-button>
      </template>
    </AttachmentDetailModal>
  </a-modal>
</template>
<script>
import apiClient from '@/utils/api-client'
import { attachmentTypes } from '@/core/constant'

export default {
  name: 'AttachmentSelectModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择附件'
    },
    multiSelect: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      list: {
        data: [],
        total: 0,
        hasNext: false,
        hasPrevious: false,
        loading: false,
        params: {
          page: 0,
          size: 40,
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
    selectPreviousButtonDisabled() {
      const index = this.list.data.findIndex(attachment => attachment.id === this.list.current.id)
      return index === 0 && !this.list.hasPrevious
    },
    selectNextButtonDisabled() {
      const index = this.list.data.findIndex(attachment => attachment.id === this.list.current.id)
      return index === this.list.data.length - 1 && !this.list.hasNext
    },
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
    markdownSyntaxList() {
      if (!this.list.selected.length) {
        return []
      }
      return this.list.selected.map(item => {
        return `![${item.name}](${item.path})`
      })
    },
    htmlSyntaxList() {
      if (!this.list.selected.length) {
        return []
      }
      return this.list.selected.map(item => {
        return `<img src="${item.path}" alt="${item.name}">`
      })
    }
  },
  watch: {
    modalVisible(value) {
      if (value) {
        this.handleListAttachments()
        this.handleListMediaTypes()
        this.handleListTypes()
      }
    }
  },
  methods: {
    /**
     * List attachments
     */
    async handleListAttachments() {
      try {
        this.list.loading = true

        const response = await apiClient.attachment.list(this.list.params)

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
     * Handle page change
     */
    handlePageChange(page = 1) {
      this.list.params.page = page - 1
      this.handleListAttachments()
    },

    /**
     * Search attachments
     */
    handleSearch() {
      this.handlePageChange(1)
    },

    /**
     * Reset search params
     */
    handleResetParam() {
      this.list.params = {
        page: 0,
        size: 40,
        keyword: undefined,
        mediaType: undefined,
        attachmentType: undefined
      }
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

    handleItemClick(attachment) {
      // single select
      if (!this.multiSelect) {
        this.$emit('confirm', {
          raw: [attachment],
          markdown: [`![${attachment.name}](${attachment.path})`],
          html: [`<img src="${attachment.path}" alt="${attachment.name}">`]
        })
        this.modalVisible = false
        return
      }

      const isSelect = this.list.selected.findIndex(item => item.id === attachment.id) > -1
      isSelect ? this.handleUnselect(attachment) : this.handleSelect(attachment)
    },

    handleSelect(attachment) {
      this.list.selected = [...this.list.selected, attachment]
    },

    handleUnselect(attachment) {
      this.list.selected = this.list.selected.filter(item => item.id !== attachment.id)
    },

    handleConfirm() {
      this.$emit('confirm', {
        raw: this.list.selected,
        markdown: this.markdownSyntaxList,
        html: this.htmlSyntaxList
      })
      this.modalVisible = false
    },

    handleOpenDetail(attachment) {
      this.list.current = attachment
      this.detailVisible = true
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
    },

    onAfterClose() {
      this.handleResetParam()
      this.list.selected = []
    }
  },
  filters: {
    typeText(type) {
      return attachmentTypes[type].text
    }
  }
}
</script>
