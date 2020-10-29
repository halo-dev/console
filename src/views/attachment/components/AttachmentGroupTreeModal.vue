<template>
  <a-modal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    destroyOnClose
    :afterClose="handleOnClose"
  >
    <a-directory-tree
      :load-data="onLoadData"
      :tree-data="treeData"
      :replaceFields="replaceFields"
      selectable
      @select="handleSelect"
      style="font-size: 16px;"
    >
    </a-directory-tree>
    <a-alert type="error" :message="tips.message" v-if="tips.visible" banner />
  </a-modal>
</template>
<script>
import attachmentApi from '@/api/attachmentGroup'
export default {
  name: 'AttachmentGroupTreeModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '移动到'
    },
    currentItems: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      replaceFields: {
        key: 'id',
        title: 'name'
      },
      treeData: [],
      selectedKeys: [],
      tips: {
        visible: false,
        message: '已经在该文件夹下'
      }
    }
  },
  mounted() {
    this.handleOnLaunch()
  },
  computed: {
    excludeKeys() {
      return this.currentItems.map(item => {
        return item.isGroup ? item.parentId : item.groupId
      })
    }
  },
  methods: {
    handleOnLaunch() {
      attachmentApi.listByParentId(0).then(res => {
        const root = {
          id: 0,
          name: '全部',
          children: res.data.data
        }
        this.treeData = [root]
      })
    },
    onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        const id = treeNode.dataRef.id || 0
        attachmentApi.listByParentId(id).then(res => {
          treeNode.dataRef.children = res.data.data
          this.treeData = [...this.treeData]
          resolve()
        })
      })
    },
    handleSelect(selectedKeys) {
      if (this.excludeKeys.includes(selectedKeys[0])) {
        this.tips = {
          visible: true,
          message: '已经在该目录下'
        }
        return
      }
      this.tips.visible = false
      this.selectedKeys = selectedKeys
    },
    handleOnClose() {
      // modal关闭时重新拉取树结构,否则会导致数据不同步
      this.handleOnLaunch()
    },
    handleOk() {
      if (this.selectedKeys.length === 0) {
        this.tips = {
          visible: true,
          message: '请选择目录'
        }
        return
      }
      this.$emit('ok', this.selectedKeys[0])
    },
    handleCancel() {
      this.selectedKeys = []
      this.tips.visible = false
      this.$emit('cancel')
    }
  }
}
</script>
