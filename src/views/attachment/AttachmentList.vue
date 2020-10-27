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
          <div class="table-operator mb-0">
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
            <a-button type="primary" icon="plus-circle" @click="() => (groupState.visible = true)"> 新建分组 </a-button>
            <a-button-group style="float: right">
              <a-button
                :type="viewModeButtonType(viewMode.flat)"
                icon="appstore"
                style="margin: 0"
                @click="handleSwitchView(viewMode.flat)"
              />
              <a-button
                :type="viewModeButtonType(viewMode.group)"
                icon="folder"
                style="margin: 0"
                @click="handleSwitchView(viewMode.group)"
              />
            </a-button-group>
          </div>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-breadcrumb style="margin-bottom: 10px">
          <a-breadcrumb-item v-for="item in groupState.history" :key="item.id">
            <span v-if="item.id === currentGroupId">{{ item.name }}</span>
            <a @click="handleBackToGroup(item)" href="#" v-else>{{ item.name }}</a>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <a-list
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
              v-if="!item.isGroup"
            >
              <div class="attach-thumb">
                <span v-show="!handleJudgeMediaType(item)">当前格式不支持预览</span>
                <img :src="item.thumbPath" v-show="handleJudgeMediaType(item)" loading="lazy" />
              </div>
              <a-input
                v-if="getRenameVisible(item)"
                ref="input"
                type="text"
                v-model="rename.name"
                @blur="handleRename"
                @keyup.enter="handleRename"
              />
              <a-card-meta class="p-3" v-else>
                <ellipsis :length="isMobile() ? 12 : 16" tooltip slot="description">{{ item.name }}</ellipsis>
              </a-card-meta>
              <a-checkbox
                class="select-attachment-checkbox"
                :style="getCheckStatus(item.id) ? selectedAttachmentStyle : ''"
                :checked="getCheckStatus(item)"
                @click="handleAttachmentSelectionChanged($event, item)"
                v-show="supportMultipleSelection"
              ></a-checkbox>
            </a-card>

            <a-card
              :bodyStyle="{ padding: 0 }"
              hoverable
              @click="handleNavigateToGroup(item)"
              @contextmenu.prevent="handleContextMenu($event, item)"
              v-else
            >
              <div class="attach-group">
                <img src="/images/folder.png" width="56%" />
              </div>
              <a-card-meta class="p-3" style="text-align: center">
                <ellipsis :length="isMobile() ? 12 : 16" tooltip slot="description">{{ item.name }}</ellipsis>
              </a-card-meta>
              <a-checkbox
                class="select-attachment-checkbox"
                :style="getCheckStatus(item.id) ? selectedAttachmentStyle : ''"
                :checked="getCheckStatus(item)"
                @click="handleAttachmentSelectionChanged($event, item)"
                v-show="supportMultipleSelection"
              ></a-checkbox>
            </a-card>
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>
    <div class="page-wrapper" v-show="viewMode.actived == viewMode.flat">
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
      <FilePondUpload ref="upload" :uploadHandler="uploadHandler" @success="handleUploadSuccess"></FilePondUpload>
    </a-modal>
    <a-modal
      title="新建分组"
      :visible="groupState.visible"
      :confirm-loading="groupState.confirmLoading"
      @ok="handleGroupModalOk"
      @cancel="() => (groupState.visible = false)"
    >
      <a-form-model ref="groupForm" :model="groupState.groupForm" :rules="groupState.rules">
        <a-form-model-item ref="name" prop="name">
          <a-input
            placeholder="分组名称"
            v-model="groupState.groupForm.name"
            @blur="
              () => {
                $refs.name.onFieldBlur()
              }
            "
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <AttachmentDetailDrawer
      v-model="drawerVisible"
      v-if="selectAttachment"
      :attachment="selectAttachment"
      :addToPhoto="true"
      @delete="handleListAttachments()"
    />
  </page-view>
</template>

<script>
import { mixin, mixinDevice } from '@/utils/mixin.js'
import { PageView } from '@/layouts'
import AttachmentDetailDrawer from './components/AttachmentDetailDrawer'
import attachmentApi from '@/api/attachment'
import attachmentGroupApi from '@/api/attachmentGroup'
import { mapGetters } from 'vuex'

export default {
  components: {
    PageView,
    AttachmentDetailDrawer
  },
  mixins: [mixin, mixinDevice],
  data() {
    return {
      attachmentType: attachmentApi.type,
      listLoading: true,
      uploadVisible: false,
      viewMode: {
        actived: 'flat',
        flat: 'flat',
        group: 'group'
      },
      rename: {},
      groupState: {
        visible: false,
        history: [
          {
            id: 0,
            name: '全部文件'
          }
        ],
        confirmLoading: false,
        groupForm: {},
        rules: {
          name: [
            { required: true, message: '请输入分组名称', trigger: 'blur' },
            { max: 100, message: '字符长度必须在小于100', trigger: 'blur' }
          ]
        }
      },
      supportMultipleSelection: false,
      selected: [],
      selectAttachment: {},
      uploadedAttachmentIds: [],
      attachments: [],
      attachmentGroups: [],
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
      drawerVisible: false,
      uploadHandler: attachmentApi.upload
    }
  },
  computed: {
    formattedDatas() {
      var dataSource = []
      this.attachmentGroups.forEach(attachmentGroup => {
        attachmentGroup.isGroup = true
        dataSource.push(attachmentGroup)
      })

      this.attachments.forEach(attachment => {
        attachment.isGroup = false
        attachment.typeProperty = this.attachmentType[attachment.type]
        dataSource.push(attachment)
      })
      return dataSource
    },
    selectedAttachmentStyle() {
      return {
        border: `2px solid ${this.color()}`
      }
    },
    viewModeButtonType() {
      return function(value) {
        return this.viewMode.actived === value ? 'primary' : 'default'
      }
    },
    currentGroupId() {
      const group = this.groupState.history[this.groupState.history.length - 1]
      return group.id
    }
  },
  created() {
    this.handleListAttachments()
    this.handleListMediaTypes()
    this.handleListTypes()
  },
  destroyed: function() {
    if (this.drawerVisible) {
      this.drawerVisible = false
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.drawerVisible) {
      this.drawerVisible = false
    }
    next()
  },
  methods: {
    ...mapGetters(['color']),
    handleListAttachmentsByViewMode() {
      this.attachments = []
      this.attachmentGroups = []
      if (this.viewMode.actived === this.viewMode.flat) {
        this.handleListAttachments()
      } else if (this.viewMode.actived === this.viewMode.group) {
        this.handleListAttachmentsWithGroup()
      }
    },
    handleListAttachments() {
      this.listLoading = true
      this.queryParam.page = this.pagination.page - 1
      this.queryParam.size = this.pagination.size
      this.queryParam.sort = this.pagination.sort
      attachmentApi
        .query(this.queryParam)
        .then(response => {
          this.attachments = response.data.data.content
          this.$log.debug('附件', this.attachments)
          this.pagination.total = response.data.data.total
        })
        .finally(() => {
          setTimeout(() => {
            this.listLoading = false
          }, 200)
        })
    },
    handleListAttachmentsWithGroup() {
      attachmentGroupApi.listBy(this.currentGroupId).then(res => {
        const data = res.data.data
        this.attachments = data.attachments
        this.attachmentGroups = data.groups
        this.$log.debug('附件和分组列表:', data)
      })
    },
    handleListMediaTypes() {
      this.mediaTypesLoading = true
      attachmentApi
        .getMediaTypes()
        .then(response => {
          this.mediaTypes = response.data.data
        })
        .finally(() => {
          setTimeout(() => {
            this.mediaTypesLoading = false
          }, 200)
        })
    },
    handleListTypes() {
      this.typesLoading = true
      attachmentApi
        .getTypes()
        .then(response => {
          this.types = response.data.data
        })
        .finally(() => {
          setTimeout(() => {
            this.typesLoading = false
          }, 200)
        })
    },
    handleShowDetailDrawer(attachment) {
      // 如果是重命名则点击item不显示drawer
      if (this.rename) {
        return
      }
      this.selectAttachment = attachment
      if (this.supportMultipleSelection) {
        this.drawerVisible = false
      } else {
        this.drawerVisible = true
      }
    },
    getRenameVisible(item) {
      return this.rename === item
    },
    handleRename() {
      const { id, name, isGroup } = this.rename
      if (isGroup) {
        this.groupState.visible = true
        this.groupState.groupForm.id = id
        this.groupState.groupForm.name = name
      } else {
        attachmentApi.update(id, { name: name }).then(response => {
          this.$log.debug('Updated attachment', response.data.data)
          this.$message.success('重命名成功')
        })
      }
    },
    handleContextMenu(event, item) {
      const menuItems = [
        {
          label: '重命名',
          onClick: () => {
            this.rename = item
          },
          divided: true
        }
      ]
      if (!item.isGroup) {
        menuItems.push({
          label: `${this.handleJudgeMediaType(item) ? '复制图片链接' : '复制文件链接'}`,
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
        })
        menuItems.push({
          disabled: !this.handleJudgeMediaType(item),
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
        })
      }
      this.$contextmenu({
        items: menuItems,
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
    handleUploadSuccess(res) {
      const id = res.data.data.id
      this.uploadedAttachmentIds.push(id)
    },
    onUploadClose() {
      this.$refs.upload.handleClearFileList()
      this.handleMoveUploadedAttachmentsToCurrentGroup()
      this.handleListMediaTypes()
      this.handleListTypes()
    },
    handleJudgeMediaType(attachment) {
      var mediaType = attachment.mediaType
      // 判断文件类型
      if (mediaType) {
        var prefix = mediaType.split('/')[0]

        if (prefix === 'image') {
          // 是图片
          return true
        } else {
          // 非图片
          return false
        }
      }
      // 没有获取到文件返回false
      return false
    },
    getCheckStatus(key) {
      return this.selected.indexOf(key) > -1
    },
    handleMultipleSelection() {
      this.supportMultipleSelection = true
      // 不允许附件详情抽屉显示
      this.drawerVisible = false
    },
    handleCancelMultipleSelection() {
      this.supportMultipleSelection = false
      this.drawerVisible = false
      this.selected = []
    },
    handleAttachmentSelectionChanged(e, item) {
      var isChecked = e.target.checked || false
      // 设置对象类型是分组还是附件
      if (isChecked) {
        this.selected.push(item)
      } else {
        // 从选中id集合中删除id
        var index = this.selected.indexOf(item)
        this.selected.splice(index, 1)
      }
    },
    handleDeleteAttachmentInBatch() {
      var that = this
      if (this.selected.length <= 0) {
        this.$message.warn('你还未选择任何附件，请至少选择一个！')
        return
      }
      const attachmentIds = []
      const groupIds = []
      this.selected.forEach(item => {
        if (item.isGroup) {
          groupIds.push(item.id)
        } else {
          attachmentIds.push(item.id)
        }
      })
      this.$log.debug('batch delete attachments:', attachmentIds)
      this.$log.debug('batch delete attachment groups:', groupIds)
      this.$confirm({
        title: '确定要批量删除选中的附件吗?',
        content: '一旦删除不可恢复，请谨慎操作',
        onOk() {
          var deleteAttachments = attachmentApi.deleteInBatch(attachmentIds)
          var deleteGroups = attachmentGroupApi.deleteInBatch(groupIds)
          // 异步编排
          Promise.all([deleteAttachments, deleteGroups])
            .then(values => {
              that.handleCancelMultipleSelection()
              that.$message.success('删除成功')
            })
            .finally(() => {
              that.handleListAttachmentsByViewMode()
            })
        },
        onCancel() {}
      })
    },
    handleMoveUploadedAttachmentsToCurrentGroup() {
      if (this.currentGroupId === 0) {
        this.uploadedAttachmentIds = []
        this.handleListAttachmentsByViewMode()
        return
      }
      attachmentApi
        .updateGroupInBatch(this.currentGroupId, this.uploadedAttachmentIds)
        .then(res => {
          this.$log.debug('move uploaded attachments to current group successfully:', res)
          this.handleListAttachmentsByViewMode()
        })
        .finally(() => (this.uploadedAttachmentIds = []))
    },
    handleGroupModalOk() {
      this.groupState.confirmLoading = true
      this.$refs.groupForm.validate(valid => {
        if (valid) {
          this.handleCreateOrUpdateGroup()
            .then(res => {
              this.$message.success('保存成功')
              this.viewMode.actived = this.viewMode.group
              this.groupState.groupForm = {}
              this.handleListAttachmentsByViewMode()
            })
            .finally(() => {
              setTimeout(() => {
                this.groupState.confirmLoading = false
                this.groupState.visible = false
              }, 200)
            })
        }
      })
    },
    handleCreateOrUpdateGroup() {
      const { groupForm } = this.groupState
      if (groupForm.id) {
        return attachmentGroupApi.updateById(groupForm.id, { name: groupForm.name })
      } else {
        // 设置parentId
        groupForm.parentId = this.currentGroupId
        return attachmentGroupApi.create(groupForm)
      }
    },
    handleSwitchView(viewMode) {
      this.viewMode.actived = viewMode
      this.handleListAttachmentsByViewMode()
    },
    handleNavigateToGroup(group) {
      if (this.supportMultipleSelection) {
        return
      }
      this.groupState.history.push({
        id: group.id,
        name: group.name
      })
      this.handleListAttachmentsByViewMode()
    },
    handleBackToGroup(group) {
      const { history } = this.groupState
      const index = history.indexOf(group)
      // 保留当前层
      history.splice(index + 1, history.length - 1)
      // 改变状态重新获取数据
      this.handleListAttachmentsByViewMode()
    }
  }
}
</script>
