<template>
  <a-drawer
    title="数据导出"
    :width="isMobile() ? '100%' : '480'"
    closable
    :visible="visible"
    destroyOnClose
    @close="onClose"
    :afterVisibleChange="handleAfterVisibleChanged"
  >
    <a-row type="flex" align="middle">
      <a-col :span="24">
        <a-alert
          message="注意：导出后的数据文件存储在临时文件中，重启服务器会造成备份文件的丢失，所以请尽快下载。"
          banner
          closable
        />
        <a-divider>历史文件</a-divider>
        <a-list itemLayout="vertical" size="small" :dataSource="files" :loading="loading">
          <template #renderItem="{ item }">
            <a-list-item>
              <template #extra>
                <a-button
                  type="link"
                  style="color: red"
                  icon="delete"
                  :loading="item.deleting"
                  @click="handleFileDeleteClick(item)"
                  >删除</a-button
                >
              </template>
              <a-list-item-meta>
                <template #title>
                  <a href="javascript:void(0)" @click="handleDownloadBackupFile(item)">
                    <a-icon type="schedule" style="color: #52c41a" />
                    {{ item.filename }}
                  </a>
                </template>
                <template #description>
                  <p>{{ item.updateTime }}/{{ item.fileSize }}</p>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-col>
    </a-row>
    <a-divider class="divider-transparent" />
    <div class="bottom-control">
      <a-space>
        <ReactiveButton
          type="primary"
          icon="download"
          @click="handleExportClick"
          @callback="handleBackupedCallback"
          :loading="backuping"
          :errored="backupErrored"
          text="备份"
          loadedText="备份成功"
          erroredText="备份失败"
        ></ReactiveButton>
        <a-button type="dashed" icon="reload" :loading="loading" @click="handleListBackups">刷新</a-button>
      </a-space>
    </div>
  </a-drawer>
</template>
<script>
import { mixin, mixinDevice } from '@/mixins/mixin.js'
import backupApi from '@/api/backup'
export default {
  name: 'ExportDataDrawer',
  mixins: [mixin, mixinDevice],
  data() {
    return {
      backuping: false,
      loading: false,
      backupErrored: false,
      files: []
    }
  },
  model: {
    prop: 'visible',
    event: 'close'
  },
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  methods: {
    handleAfterVisibleChanged(visible) {
      if (visible) {
        this.handleListBackups()
      }
    },
    handleListBackups() {
      this.loading = true
      backupApi
        .listExportedData()
        .then(response => {
          this.files = response.data.data
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false
          }, 200)
        })
    },
    handleExportClick() {
      this.backuping = true
      backupApi
        .exportData()
        .catch(() => {
          this.backupErrored = true
        })
        .finally(() => {
          setTimeout(() => {
            this.backuping = false
          }, 400)
        })
    },
    handleBackupedCallback() {
      if (this.backupErrored) {
        this.backupErrored = false
      } else {
        this.handleListBackups()
      }
    },
    handleFileDeleteClick(file) {
      file.deleting = true
      backupApi.deleteExportedData(file.filename).finally(() => {
        setTimeout(() => {
          file.deleting = false
        }, 400)
        this.handleListBackups()
      })
    },
    handleDownloadBackupFile(item) {
      backupApi
        .fetchData(item.filename)
        .then(response => {
          var downloadElement = document.createElement('a')
          var href = new window.URL(response.data.data.downloadLink)
          downloadElement.href = href
          downloadElement.download = response.data.data.filename
          document.body.appendChild(downloadElement)
          downloadElement.click()
          document.body.removeChild(downloadElement)
          window.URL.revokeObjectURL(href)
        })
        .catch(() => {
          this.$message.error('下载失败！')
        })
    },
    onClose() {
      this.$emit('close', false)
    }
  }
}
</script>
