<template>
  <a-modal v-model="modalVisible" :afterClose="onAfterClose" :title="title" :width="1024" destroyOnClose>
    <a-list
      :dataSource="list.data"
      :grid="{ gutter: 6, xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }"
      :loading="list.loading"
      class="attachments-group"
    >
      <a-list-item :key="index" slot="renderItem" slot-scope="item, index" @click="handleItemClick(item)">
        <div :class="itemClass(item)" class="border border-solid">
          <div class="attach-thumb attachments-group-item">
            <span v-if="!isImage(item)" class="attachments-group-item-type">{{ item.suffix }}</span>
            <span
              v-else
              :style="`background-image:url(${item.thumbPath})`"
              class="attachments-group-item-img"
              loading="lazy"
            />
          </div>
          <a-card-meta class="p-2 cursor-pointer">
            <template #description>
              <a-tooltip :title="item.name">
                <div class="truncate">{{ item.name }}</div>
              </a-tooltip>
            </template>
          </a-card-meta>
        </div>
      </a-list-item>
    </a-list>
    <div class="page-wrapper"></div>

    <div class="flex justify-between">
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
          <div class="self-center text-slate-400 select-none cursor-pointer hover:text-blue-400 transition-all">
            已选择 {{ list.selected.length }} 项
          </div>
        </a-tooltip>
      </a-popover>

      <div class="flex justify-end self-center">
        <a-pagination
          :current="pagination.page"
          :defaultPageSize="pagination.size"
          :pageSizeOptions="['12', '18', '24', '30', '36', '42']"
          :total="pagination.total"
          class="pagination"
          showLessItems
          showSizeChanger
          @change="handlePageChange"
          @showSizeChange="handlePageSizeChange"
        />
      </div>
    </div>

    <template slot="footer">
      <a-button @click="modalVisible = false">取消</a-button>
      <a-button type="primary" @click="handleConfirm">确定</a-button>
    </template>
  </a-modal>
</template>
<script>
import apiClient from '@/utils/api-client'

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
        loading: false,
        params: {
          page: 0,
          size: 12
        },
        selected: []
      }
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
    isImage() {
      return function (attachment) {
        if (!attachment || !attachment.mediaType) {
          return false
        }
        return attachment.mediaType.startsWith('image')
      }
    },
    itemClass() {
      return function (attachment) {
        const isSelect = this.list.selected.findIndex(item => item.id === attachment.id) > -1
        return isSelect ? 'border-blue-600' : 'border-slate-200'
      }
    },
    markdownSyntaxList() {
      if (!this.list.selected.length) {
        return []
      }
      return this.list.selected.map(item => {
        return `![${item.name}](${encodeURI(item.path)})`
      })
    },
    htmlSyntaxList() {
      if (!this.list.selected.length) {
        return []
      }
      return this.list.selected.map(item => {
        return `<img src="${encodeURI(item.path)}" alt="${item.name}">`
      })
    }
  },
  watch: {
    modalVisible(value) {
      value && this.handleListAttachments()
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
      } catch (error) {
        this.$log.error(error)
      } finally {
        this.list.loading = false
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
          markdown: [`![${attachment.name}](${encodeURI(attachment.path)})`],
          html: [`<img src="${encodeURI(attachment.path)}" alt="${attachment.name}">`]
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

    onAfterClose() {
      this.list.selected = []
    }
  }
}
</script>
