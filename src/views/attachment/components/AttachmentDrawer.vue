<template>
  <div>
    <a-drawer
      :afterVisibleChange="handleAfterVisibleChanged"
      :visible="visible"
      :width="isMobile() ? '100%' : '480'"
      closable
      destroyOnClose
      title="附件库"
      @close="onClose"
    >
      <a-row align="middle" type="flex">
        <a-input-search v-model="queryParam.keyword" enterButton placeholder="搜索附件" @search="handleQuery()" />
      </a-row>
      <a-divider />
      <a-row align="middle" type="flex">
        <a-col :span="24">
          <a-spin :spinning="loading" class="attachments-group">
            <a-empty v-if="formattedDatas.length === 0" />
            <div
              v-for="(item, index) in formattedDatas"
              v-else
              :key="index"
              class="attach-item attachments-group-item"
              @click="handleShowDetailDrawer(item)"
              @contextmenu.prevent="handleContextMenu($event, item)"
            >
              <span v-if="!handleJudgeMediaType(item)" class="attachments-group-item-type">{{ item.suffix }}</span>
              <span
                v-else
                :style="`background-image:url(${item.thumbPath})`"
                class="attachments-group-item-img"
                loading="lazy"
              />
            </div>
          </a-spin>
        </a-col>
      </a-row>
      <a-divider />
      <div class="page-wrapper">
        <a-pagination
          :current="pagination.page"
          :defaultPageSize="pagination.size"
          :total="pagination.total"
          showLessItems
          @change="handlePaginationChange"
        ></a-pagination>
      </div>

      <!-- <AttachmentDetailDrawer
        v-model="detailVisible"
        v-if="selectedAttachment"
        :attachment="selectedAttachment"
        @delete="handleListAttachments"
      /> -->
      <a-divider class="divider-transparent" />
      <div class="bottom-control">
        <a-button type="primary" @click="uploadVisible = true">上传附件</a-button>
      </div>
    </a-drawer>

    <a-modal v-model="uploadVisible" :afterClose="onUploadClose" :footer="null" destroyOnClose title="上传附件">
      <FilePondUpload ref="upload" :uploadHandler="uploadHandler"></FilePondUpload>
    </a-modal>
  </div>
</template>

<script>
import { mixin, mixinDevice } from '@/mixins/mixin.js'
// import AttachmentDetailDrawer from './AttachmentDetailDrawer'
import attachmentApi from '@/api/attachment'
import apiClient from '@/utils/api-client'

export default {
  name: 'AttachmentDrawer',
  mixins: [mixin, mixinDevice],
  components: {
    // AttachmentDetailDrawer
  },
  model: {
    prop: 'visible',
    event: 'close'
  },
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      attachmentType: attachmentApi.type,
      detailVisible: false,
      attachmentDrawerVisible: false,
      uploadVisible: false,
      loading: true,
      pagination: {
        page: 1,
        size: 12,
        sort: null,
        total: 1
      },
      queryParam: {
        page: 0,
        size: 12,
        sort: null,
        keyword: null
      },
      attachments: [],
      selectedAttachment: {},
      uploadHandler: attachmentApi.upload
    }
  },
  computed: {
    formattedDatas() {
      return this.attachments.map(attachment => {
        attachment.typeProperty = this.attachmentType[attachment.type]
        return attachment
      })
    }
  },
  methods: {
    handleShowDetailDrawer(attachment) {
      this.selectedAttachment = attachment
      this.$log.debug('Show detail of', attachment)
      this.detailVisible = true
    },
    handleContextMenu(event, item) {
      this.$contextmenu({
        items: [
          {
            label: '复制图片链接',
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
            }
          }
        ],
        event,
        zIndex: 1001,
        minWidth: 210
      })
      return false
    },
    handleListAttachments() {
      this.loading = true
      this.queryParam.page = this.pagination.page - 1
      this.queryParam.size = this.pagination.size
      this.queryParam.sort = this.pagination.sort
      apiClient.attachment
        .list(this.queryParam)
        .then(response => {
          this.attachments = response.data.content
          this.pagination.total = response.data.total
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false
          }, 200)
        })
    },
    handleQuery() {
      this.handlePaginationChange(1, this.pagination.size)
    },
    handlePaginationChange(page, pageSize) {
      this.pagination.page = page
      this.pagination.size = pageSize
      this.handleListAttachments()
    },
    onUploadClose() {
      this.$refs.upload.handleClearFileList()
      this.handlePaginationChange(1, this.pagination.size)
    },
    handleAfterVisibleChanged(visible) {
      if (visible) {
        this.handleListAttachments()
      }
    },
    handleJudgeMediaType(attachment) {
      const mediaType = attachment.mediaType
      // 判断文件类型
      if (mediaType) {
        const prefix = mediaType.split('/')[0]

        return prefix === 'image'
      }
      // 没有获取到文件返回false
      return false
    },
    onClose() {
      this.$emit('close', false)
    }
  }
}
</script>
