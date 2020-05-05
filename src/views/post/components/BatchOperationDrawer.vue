<template>
  <a-drawer
    title="批量操作"
    :width="isMobile()?'100%':'480'"
    placement="right"
    closable
    destroyOnClose
    @close="onClose"
    :visible="visible"
  >
    <a-skeleton
      active
      :loading="settingLoading"
      :paragraph="{ rows: 24 }"
    >
      <div class="post-setting-drawer-content">
        <div :style="{ marginBottom: '16px' }">
          <h3 class="post-setting-drawer-title">基本设置</h3>
          <br>
          <div class="post-setting-drawer-item">
            <a-form layout="vertical">
              <a-form-item label="开启评论：">
                <a-radio-group
                  v-model="disallowComment"
                  :defaultValue="null"
                >
                  <a-radio :value="null">不改变</a-radio>
                  <a-radio :value="false">开启</a-radio>
                  <a-radio :value="true">关闭</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="是否置顶：">
                <a-radio-group
                  v-model="topPriority"
                  :defaultValue="null"
                >
                  <a-radio :value="null">不改变</a-radio>
                  <a-radio :value="1">是</a-radio>
                  <a-radio :value="0">否</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-form>
          </div>
        </div>
        <a-divider />

        <div :style="{ marginBottom: '16px' }">
          <h3 class="post-setting-drawer-title">分类目录</h3>
          <div class="post-setting-drawer-item">
            <a-form layout="vertical">
              <a-form-item>
                <category-tree
                  v-model="selectedCategoryIds"
                  :categories="categories"
                />
              </a-form-item>
              <a-form-item v-if="categoryFormVisible">
                <category-select-tree
                  :categories="categories"
                />
              </a-form-item>
              <a-form-item v-if="categoryFormVisible">
                <a-input
                  placeholder="分类名称"
                />
              </a-form-item>
              <a-form-item v-if="categoryFormVisible">
                <a-input
                  placeholder="分类路径"
                />
              </a-form-item>
              <a-form-item>
                <a-button
                  type="primary"
                  style="marginRight: 8px"
                  v-if="categoryFormVisible"
                  @click="handlerCreateCategory"
                >保存</a-button>
                <a-button
                  type="dashed"
                  style="marginRight: 8px"
                  v-if="!categoryFormVisible"
                  @click="toggleCategoryForm"
                >新增</a-button>
                <a-button
                  v-if="categoryFormVisible"
                  @click="toggleCategoryForm"
                >取消</a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
        <a-divider />

        <div :style="{ marginBottom: '16px' }">
          <h3 class="post-setting-drawer-title">标签</h3>
          <div class="post-setting-drawer-item">
            <a-form layout="vertical">
              <a-form-item>
                <TagSelect v-model="selectedTagIds" />
              </a-form-item>
            </a-form>
          </div>
        </div>
        <a-divider />

        <a-divider class="divider-transparent" />
      </div>
    </a-skeleton>

    <div class="bottom-control">
      <a-button
        type="primary"
        :loading="saving"
        @click="handleSaveSettings"
      >保存</a-button>
    </div>
  </a-drawer>
</template>
<script>
import { mixin, mixinDevice } from '@/utils/mixin.js'
import moment from 'moment'
import CategoryTree from './CategoryTree'
import CategorySelectTree from './CategorySelectTree'
import TagSelect from './TagSelect'
import { mapGetters } from 'vuex'
import categoryApi from '@/api/category'
import postApi from '@/api/post'
import themeApi from '@/api/theme'
export default {
  name: 'BatchOperationDrawer',
  mixins: [mixin, mixinDevice],
  components: {
    CategoryTree,
    CategorySelectTree,
    TagSelect
  },
  data() {
    return {
      categoryFormVisible: false,
      settingLoading: true,
      selectedPostIds: this.postIds,
      categories: [],
      categoryToCreate: {},
      disallowComment: null,
      topPriority: null,
      selectedCategoryIds: [],
      selectedTagIds: [],
    }
  },
  props: {
    postIds: {
      type: Array,
      required: true
    },
    visible: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    visible(newValue, oldValue) {
      if (newValue) {
        this.loadSkeleton()
        this.loadCategories()
      }
    }
  },
  methods: {
    loadSkeleton() {
      this.settingLoading = true
      setTimeout(() => {
        this.settingLoading = false
      }, 500)
    },
    loadCategories() {
      categoryApi.listAll().then(response => {
        this.categories = response.data.data
      })
    },
    handlerCreateCategory() {
      if (!this.categoryToCreate.name) {
        this.$notification['error']({
          message: '提示',
          description: '分类名称不能为空！'
        })
        return
      }
      categoryApi.create(this.categoryToCreate).then(response => {
        this.loadCategories()
        this.categoryToCreate = {}
        this.toggleCategoryForm()
      })
    },
    handleSaveSettings() {
      console.log(this.disallowComment)
      console.log(this.topPriority)
      console.log(this.selectedTagIds)
      console.log(this.selectedCategoryIds)
      console.log("SAVE")
    },
    toggleCategoryForm() {
      this.categoryFormVisible = !this.categoryFormVisible
    },
    onClose() {
      this.$emit('close', false)
    }
  }
}
</script>
