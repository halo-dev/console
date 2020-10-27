<template>
  <a-modal
    v-model="visible"
    title="从系统预设链接添加菜单"
    :width="1024"
    :bodyStyle="{ padding: '0 24px 24px' }"
  >
    <template slot="footer">
      <a-button @click="handleCancel">
        取消
      </a-button>
      <ReactiveButton
        @click="handleCreateBatch"
        @callback="handleCreateBatchCallback"
        :loading="saving"
        :errored="saveErrored"
        text="添加"
        loadedText="添加成功"
        erroredText="添加失败"
      ></ReactiveButton>
    </template>
    <a-row :gutter="24">
      <a-col :span="12">
        <div class="custom-tab-wrapper">
          <a-tabs default-active-key="1">
            <a-tab-pane
              key="1"
              tab="分类目录"
              force-render
            >
              <a-list item-layout="horizontal">
                <a-list-item
                  v-for="(category,index) in categories"
                  :key="index"
                >
                  <a-list-item-meta>
                    <span slot="title">{{ category.name }}</span>
                    <span slot="description">{{ category.fullPath }}</span>
                  </a-list-item-meta>
                  <template slot="actions">
                    <a href="javascript:void(0);">
                      <a-icon
                        type="plus-circle"
                        @click="handleInsertPre(category.name,category.fullPath)"
                      />
                    </a>
                  </template>
                </a-list-item>
              </a-list>
            </a-tab-pane>
            <a-tab-pane
              key="2"
              tab="标签"
            >
              <a-list item-layout="horizontal">
                <a-list-item
                  v-for="(tag,index) in tags"
                  :key="index"
                >
                  <a-list-item-meta>
                    <span slot="title">{{ tag.name }}</span>
                    <span slot="description">{{ tag.fullPath }}</span>
                  </a-list-item-meta>
                  <template slot="actions">
                    <a href="javascript:void(0);">
                      <a-icon
                        type="plus-circle"
                        @click="handleInsertPre(tag.name,tag.fullPath)"
                      />
                    </a>
                  </template>
                </a-list-item>
              </a-list>
            </a-tab-pane>
            <a-tab-pane
              key="3"
              tab="独立页面"
            >
              <a-list item-layout="horizontal">
                <a-list-item
                  v-for="(item,index) in sheet.independents"
                  :key="index"
                >
                  <a-list-item-meta>
                    <span slot="title">{{ item.title }}</span>
                    <span slot="description">{{ item.fullPath }}</span>
                  </a-list-item-meta>
                  <template slot="actions">
                    <a href="javascript:void(0);">
                      <a-icon
                        type="plus-circle"
                        @click="handleInsertPre(item.title,item.fullPath)"
                      />
                    </a>
                  </template>
                </a-list-item>
              </a-list>
            </a-tab-pane>
            <a-tab-pane
              key="4"
              tab="自定义页面"
            >
              // TODO
            </a-tab-pane>
            <a-tab-pane
              key="5"
              tab="其他"
            >
              // TODO
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="custom-tab-wrapper">
          <a-tabs default-active-key="1">
            <a-tab-pane
              key="1"
              tab="备选"
              force-render
            >
              <a-list item-layout="horizontal">
                <a-list-item
                  v-for="(menu,index) in menus"
                  :key="index"
                >
                  <a-list-item-meta>
                    <span slot="title">{{ menu.name }}</span>
                    <span slot="description">{{ menu.url }}</span>
                  </a-list-item-meta>
                  <template slot="actions">
                    <a
                      href="javascript:void(0);"
                      @click="handleRemovePre(index)"
                    >
                      <a-icon type="close-circle" />
                    </a>
                  </template>
                </a-list-item>
              </a-list>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script>
import categoryApi from '@/api/category'
import tagApi from '@/api/tag'
import menuApi from '@/api/menu'
import sheetApi from '@/api/sheet'
export default {
  name: 'MenuInternalLinkSelector',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    team: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      categories: [],
      tags: [],
      menus: [],
      sheet: {
        independents: [],
        customs: [],
      },
      saving: false,
      saveErrored: false,
    }
  },
  computed: {
    visible: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  watch: {
    visible(value) {
      if (value) {
        this.handleListCategories()
        this.handleListTags()
        this.handleListIndependentSheets()
      }
    },
  },
  methods: {
    handleListCategories() {
      categoryApi.listAll(true).then((response) => {
        this.categories = response.data.data
      })
    },
    handleListTags() {
      tagApi.listAll(true).then((response) => {
        this.tags = response.data.data
      })
    },
    handleListIndependentSheets() {
      sheetApi.listIndependent().then((response) => {
        this.sheet.independents = response.data.data
      })
    },
    handleInsertPre(name, url) {
      this.menus.push({
        name: name,
        url: url,
        team: this.team,
      })
    },
    handleRemovePre(index) {
      this.menus.splice(index, 1)
    },
    handleCancel() {
      this.menus = []
      this.visible = false
      this.$emit('reload')
    },
    handleCreateBatch() {
      this.saving = true
      menuApi
        .createBatch(this.menus)
        .catch(() => {
          this.saveErrored = false
        })
        .finally(() => {
          setTimeout(() => {
            this.saving = false
          }, 400)
        })
    },
    handleCreateBatchCallback() {
      if (this.saveErrored) {
        this.saveErrored = false
      } else {
        this.handleCancel()
      }
    },
  },
}
</script>
