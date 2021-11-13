<template>
  <page-view>
    <a-row :gutter="12" type="flex" align="middle">
      <a-col :span="24" class="pb-3">
        <a-card :bordered="false" :bodyStyle="{ padding: '16px' }">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="6" :sm="24">
                  <a-form-item label="关键词：">
                    <a-input v-model="queryParam.keyword" @keyup.enter="handleQuery()" />
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="存储位置：">
                    <a-select
                      v-model="queryParam.attachmentType"
                      @change="handleQuery()"
                      :loading="typesLoading"
                      allowClear
                    >
                      <a-select-option v-for="item in types" :key="item" :value="item">{{
                        attachmentType[item].text
                      }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="文件类型：">
                    <a-select
                      v-model="queryParam.mediaType"
                      @change="handleQuery()"
                      :loading="mediaTypesLoading"
                      allowClear
                    >
                      <a-select-option v-for="(item, index) in mediaTypes" :key="index" :value="item">{{
                        item
                      }}</a-select-option>
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
          <div class="mb-0 table-operator">
            <a-button type="primary" icon="cloud-upload" @click="() => (uploadVisible = true)">上传</a-button>
            <a-button icon="select" v-show="!supportMultipleSelection" @click="handleMultipleSelection">
              批量操作
            </a-button>
            <a-button
              type="danger"
              icon="delete"
              v-show="supportMultipleSelection"
              @click="handleDeleteAttachmentInBatch"
            >
              删除
            </a-button>
            <a-button icon="close" v-show="supportMultipleSelection" @click="handleCancelMultipleSelection">
              取消
            </a-button>
          </div>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-list
          class="attachments-group"
          :grid="{ gutter: 12, xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }"
          :dataSource="formattedDatas"
          :loading="listLoading"
        >
          <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
            <a-card
              :bodyStyle="{ padding: 0 }"
              hoverable
              @click="handleShowDetailDrawer(item)"
              @contextmenu.prevent="handleContextMenu($event, item)"
            >
              <div class="attach-thumb attachments-group-item">
                <span v-if="!isImage(item)" class="attachments-group-item-type">{{ item.suffix }}</span>
                <span
                  v-else
                  class="attachments-group-item-img"
                  :style="`background-image:url(${item.thumbPath})`"
                  loading="lazy"
                />
              </div>
              <a-card-meta class="p-3">
                <ellipsis :length="isMobile() ? 12 : 16" tooltip slot="description">{{ item.name }}</ellipsis>
              </a-card-meta>
              <a-checkbox
                class="select-attachment-checkbox"
                :style="getCheckStatus(item.id) ? selectedAttachmentStyle : ''"
                :checked="getCheckStatus(item.id)"
                @click="handleAttachmentSelectionChanged($event, item)"
                v-show="supportMultipleSelection"
              ></a-checkbox>
            </a-card>
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>
    <div class="page-wrapper">
      <a-pagination
        class="pagination"
        :current="pagination.page"
        :total="pagination.total"
        :defaultPageSize="pagination.size"
        :pageSizeOptions="['18', '36', '54', '72', '90', '108']"
        showSizeChanger
        @change="handlePaginationChange"
        @showSizeChange="handlePaginationChange"
        showLessItems
      />
    </div>
    <a-modal title="上传附件" v-model="uploadVisible" :footer="null" :afterClose="onUploadClose" destroyOnClose>
      <FilePondUpload ref="upload" :uploadHandler="uploadHandler"></FilePondUpload>
    </a-modal>
    <AttachmentDetailModal
      :visible.sync="detailVisible"
      :attachment="selectAttachment"
      :addToPhoto="true"
      @delete="handleListAttachments()"
    >
      <template #extraFooter>
        <a-button type="primary" ghost @click="handleSelectPrevious">上一项</a-button>
        <a-button type="primary" ghost @click="handleSelectNext">下一项</a-button>
      </template>
    </AttachmentDetailModal>
  </page-view>
</template>

<script>
import { mixin, mixinDevice } from '@/mixins/mixin.js'
import { PageView } from '@/layouts'
import AttachmentDetailModal from './components/AttachmentDetailModal.vue'
import attachmentApi from '@/api/attachment'
import { mapGetters } from 'vuex'

export default {
  components: {
    PageView,
    AttachmentDetailModal
  },
  mixins: [mixin, mixinDevice],
  data() {
    return {
      attachmentType: attachmentApi.type,
      listLoading: true,
      uploadVisible: false,
      supportMultipleSelection: false,
      selectedAttachmentCheckbox: {},
      batchSelectedAttachments: [],
      selectAttachment: {},
      attachments: [],
      mediaTypes: [],
      mediaTypesLoading: false,
      types: [],
      typesLoading: false,
      editable: false,
      pagination: {
        page: 1,
        size: 18,
        sort: null,
        total: 1
      },
      queryParam: {
        page: 0,
        size: 18,
        sort: null,
        keyword: null,
        mediaType: null,
        attachmentType: null
      },
      detailVisible: false,
      uploadHandler: attachmentApi.upload
    }
  },
  computed: {
    formattedDatas() {
      return this.attachments.map(attachment => {
        attachment.typeProperty = this.attachmentType[attachment.type]
        return attachment
      })
    },
    selectedAttachmentStyle() {
      return {
        border: `2px solid ${this.color()}`
      }
    },
    isImage() {
      return function(attachment) {
        if (!attachment || !attachment.mediaType) {
          return false
        }
        return attachment.mediaType.startsWith('image')
      }
    }
  },
  created() {
    this.handleListAttachments()
    this.handleListMediaTypes()
    this.handleListTypes()
  },
  destroyed() {
    if (this.detailVisible) {
      this.detailVisible = false
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.detailVisible) {
      this.detailVisible = false
    }
    next()
  },
  methods: {
    ...mapGetters(['color']),
    handleListAttachments() {
      this.listLoading = true
      this.queryParam.page = this.pagination.page - 1
      this.queryParam.size = this.pagination.size
      this.queryParam.sort = this.pagination.sort
      attachmentApi
        .query(this.queryParam)
        .then(response => {
          this.attachments = response.data.data.content
          this.pagination.total = response.data.data.total
        })
        .finally(() => {
          setTimeout(() => {
            this.listLoading = false
          }, 200)
        })
    },
    async handleListMediaTypes() {
      try {
        this.mediaTypesLoading = true

        const response = await attachmentApi.getMediaTypes()

        this.mediaTypes = response.data.data
      } catch (error) {
        this.$log.error(error)
      } finally {
        this.mediaTypesLoading = false
      }
    },
    async handleListTypes() {
      try {
        this.typesLoading = true

        const response = await attachmentApi.getTypes()

        this.types = response.data.data
      } catch (error) {
        this.$log.error(error)
      } finally {
        this.typesLoading = false
      }
    },
    handleShowDetailDrawer(attachment) {
      this.selectAttachment = attachment
      this.detailVisible = !this.supportMultipleSelection
    },
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
            }
          }
        ],
        event,
        minWidth: 210
      })
      return false
    },
    handlePaginationChange(page, size) {
      this.$log.debug(`Current: ${page}, PageSize: ${size}`)
      this.pagination.page = page
      this.pagination.size = size
      this.handleListAttachments()
    },
    handleResetParam() {
      this.queryParam.keyword = null
      this.queryParam.mediaType = null
      this.queryParam.attachmentType = null
      this.handlePaginationChange(1, this.pagination.size)
      this.handleListMediaTypes()
      this.handleListTypes()
    },
    handleQuery() {
      this.handlePaginationChange(1, this.pagination.size)
    },
    onUploadClose() {
      this.$refs.upload.handleClearFileList()
      this.handlePaginationChange(1, this.pagination.size)
      this.handleListMediaTypes()
      this.handleListTypes()
    },
    getCheckStatus(key) {
      return this.selectedAttachmentCheckbox[key] || false
    },
    handleMultipleSelection() {
      this.supportMultipleSelection = true
      // 不允许附件详情抽屉显示
      this.detailVisible = false
      this.attachments.forEach(item => {
        this.$set(this.selectedAttachmentCheckbox, item.id, false)
      })
    },
    handleCancelMultipleSelection() {
      this.supportMultipleSelection = false
      this.detailVisible = false
      this.batchSelectedAttachments = []
      for (const key in this.selectedCheckbox) {
        this.$set(this.selectedAttachmentCheckbox, key, false)
      }
    },
    handleAttachmentSelectionChanged(e, item) {
      const isChecked = e.target.checked || false
      if (isChecked) {
        this.$set(this.selectedAttachmentCheckbox, item.id, true)
        this.batchSelectedAttachments.push(item.id)
      } else {
        this.$set(this.selectedAttachmentCheckbox, item.id, false)
        // 从选中id集合中删除id
        const index = this.batchSelectedAttachments.indexOf(item.id)
        this.batchSelectedAttachments.splice(index, 1)
      }
    },
    handleDeleteAttachmentInBatch() {
      const that = this
      if (this.batchSelectedAttachments.length <= 0) {
        this.$message.warn('你还未选择任何附件，请至少选择一个！')
        return
      }
      this.$confirm({
        title: '确定要批量删除选中的附件吗?',
        content: '一旦删除不可恢复，请谨慎操作',
        onOk() {
          attachmentApi
            .deleteInBatch(that.batchSelectedAttachments)
            .then(() => {
              that.handleCancelMultipleSelection()
              that.$message.success('删除成功')
            })
            .finally(() => {
              that.handleListAttachments()
            })
        },
        onCancel() {}
      })
    },

    /**
     * Select previous attachment
     */
    handleSelectPrevious() {
      const index = this.attachments.findIndex(item => item.id === this.selectAttachment.id)
      if (index === 0) {
        this.$message.warn('已经是第一个了')
        return
      }
      this.selectAttachment = this.attachments[index - 1]
    },

    /**
     * Select next attachment
     */
    handleSelectNext() {
      const index = this.attachments.findIndex(item => item.id === this.selectAttachment.id)
      if (index === this.attachments.length - 1) {
        this.$message.warn('已经是最后一个了')
        return
      }
      this.selectAttachment = this.attachments[index + 1]
    }
  }
}
</script>
