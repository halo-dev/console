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
          <br />
          <div class="post-setting-drawer-item">
            <a-form layout="vertical">
              <a-form-item label="开启评论：">
                <a-radio-group
                  v-model="disallowComment"
                  :defaultValue="null"
                >
                  <a-radio :value="null">不更变</a-radio>
                  <a-radio :value="false">开启</a-radio>
                  <a-radio :value="true">关闭</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="是否置顶：">
                <a-radio-group
                  v-model="topPriority"
                  :defaultValue="null"
                >
                  <a-radio :value="null">不更变</a-radio>
                  <a-radio :value="1">是</a-radio>
                  <a-radio :value="0">否</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-form>
          </div>
        </div>
        <a-divider />

        <div :style="{ marginBottom: '16px' }">
            <h3
              class="post-setting-drawer-title"
            >分类目录
              <a-switch
                checked-children="覆盖"
                un-checked-children="不更变"
                v-model="categorySwitch"
                style="float: right;"/>
            </h3>
          <div class="post-setting-drawer-item">
            <a-form layout="vertical">
              <a-form-item>
                <category-tree
                  v-model="selectedCategoryIds"
                  :disabled="!categorySwitch"
                  :categories="categories"
                />
              </a-form-item>
              <a-form-item v-if="categoryFormVisible && categorySwitch">
                <category-select-tree
                  :categories="categories"
                  v-model="categoryToCreate.parentId"
                />
              </a-form-item>
              <a-form-item v-if="categoryFormVisible && categorySwitch">
                <a-input
                  placeholder="分类名称"
                  v-model="categoryToCreate.name"
                />
              </a-form-item>
              <a-form-item v-if="categoryFormVisible && categorySwitch">
                <a-input
                  placeholder="分类路径"
                  v-model="categoryToCreate.slug"
                />
              </a-form-item>
              <a-form-item>
                <a-button
                  type="primary"
                  style="marginRight: 8px"
                  v-if="categoryFormVisible && categorySwitch"
                  @click="handlerCreateCategory"
                >保存</a-button>
                <a-button
                  type="dashed"
                  style="marginRight: 8px"
                  v-if="!categoryFormVisible && categorySwitch"
                  @click="toggleCategoryForm"
                >新增</a-button>
                <a-button
                  v-if="categoryFormVisible && categorySwitch"
                  @click="toggleCategoryForm"
                >取消</a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
        <a-divider />

        <div :style="{ marginBottom: '16px' }">
          <h3
            class="post-setting-drawer-title"
          >标签
            <a-switch
              checked-children="覆盖"
              un-checked-children="不更变"
              v-model="tagSwitch"
              style="float: right;"/>
          </h3>
          <div class="post-setting-drawer-item">
            <a-form layout="vertical">
              <a-form-item>
                <TagSelect
                  v-model="selectedTagIds"
                  :disabled="!tagSwitch"
                />
              </a-form-item>
            </a-form>
          </div>
        </div>
        <a-divider />

        <div :style="{ marginBottom: '16px' }">
          <h3
            class="post-setting-drawer-title"
          >加密设置
            <a-switch
              checked-children="覆盖"
              un-checked-children="不更变"
              v-model="passwordSwitch"
              style="float: right;"/>
          </h3>
          <div class="post-setting-drawer-item">
            <a-form layout="vertical">
              <a-form-item label="访问密码：">
                <a-input-password
                  :disabled="!passwordSwitch"
                  v-model="password"
                  autocomplete="new-password"
                />
              </a-form-item>
            </a-form>
          </div>
        </div>

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
      saving: false,
      selectedPosts: this.posts,
      selectedPostIds: this.postIds,
      categories: [],
      categoryToCreate: {},
      disallowComment: null,
      topPriority: null,
      selectedCategoryIds: [],
      selectedTagIds: [],
      password: "",
      categorySwitch: false,
      tagSwitch: false,
      passwordSwitch: false
    }
  },
  props: {
    posts: {
      type: Array,
      required: true
    },
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
    posts(val) {
      this.selectedPosts = val
      // if all posts have the same setting, then display it
      const disallowCommentEqual =
        val.every((val, i, arr) => val.disallowComment === arr[0].disallowComment)
      const topPriorityEqual =
        val.every((val, i, arr) => val.topPriority === arr[0].topPriority)
      this.categorySwitch =
        val.every((val, i, arr) => val.categoryIds.sort().toString() === arr[0].categoryIds.sort().toString())
      this.tagSwitch =
        val.every((val, i, arr) => val.tagIds.sort().toString() === arr[0].tagIds.sort().toString())
      this.passwordSwitch =
        val.every((val, i, arr) => val.password === arr[0].password)
      this.disallowComment = disallowCommentEqual ? val[0].disallowComment : null
      this.topPriority = topPriorityEqual ? val[0].topPriority : null
      this.selectedCategoryIds = this.categorySwitch ? val[0].categoryIds : null
      this.selectedTagIds = this.tagSwitch ? val[0].tagIds : null
      this.password = this.passwordSwitch ? val[0].password : null
    },
    postIds(val) {
      this.selectedPostIds = val
    },
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
      this.saving = true
      // construct a param by the status of switch
      // selectedTagIds is default to be null, but we need []
      const settingParams = {
        ids: this.selectedPostIds,
        disallowComment: this.disallowComment,
        topPriority: this.topPriority,
        password: this.passwordSwitch ? this.password : null,
        tagIds: this.tagSwitch ? (this.selectedTagIds == null ? [] : this.selectedTagIds) : null,
        categoryIds: this.categorySwitch ? this.selectedCategoryIds : null
      }
      postApi.updataSettingInBatch(settingParams)
        .then(response => {
          this.$log.debug('Updated post', response.data.data)

          this.$message.success('批量操作成功！')

          this.$emit('close')
        })
        .finally(() => {
          this.saving = false
          this.draftSaving = false
        })
    },
    toggleCategoryForm() {
      this.categoryFormVisible = !this.categoryFormVisible
    }
  }
}
</script>
