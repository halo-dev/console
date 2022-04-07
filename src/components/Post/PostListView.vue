<template>
  <div>
    <a-card :bodyStyle="{ padding: '16px' }" :bordered="false">
      <div v-if="searchWrapper" class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="关键词：">
                <a-input v-model="list.params.keyword" @keyup.enter="handleQuery()" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="文章状态：">
                <a-select
                  v-model="list.params.status"
                  allowClear
                  placeholder="请选择文章状态"
                  @change="handleChangeQueryStatus"
                >
                  <a-select-option v-for="status in Object.keys(normalPostStatuses)" :key="status" :value="status">
                    {{ postStatuses[status].text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="分类目录：">
                <CategorySelectTree
                  :categories="categories.data"
                  :category-id.sync="list.params.categoryId"
                  :root="{
                    id: 0,
                    title: '全部',
                    value: '0',
                    pId: -1
                  }"
                  @change="handleQuery"
                />
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

      <div class="mb-5">
        <a-space>
          <slot name="operator-before" />
          <a-dropdown v-if="selectedRowKeys.length && !isMobile()">
            <template #overlay>
              <a-menu>
                <a-menu-item @click="handleChangeStatusInBatch(postStatuses.PUBLISHED.value)">发布</a-menu-item>
                <a-menu-item @click="handleChangeStatusInBatch(postStatuses.DRAFT.value)">转为草稿</a-menu-item>
                <a-menu-item v-if="defaultStatuses.includes(postStatuses.RECYCLE.value)" @click="handleDeleteInBatch">
                  永久删除
                </a-menu-item>
                <a-menu-item v-else @click="handleChangeStatusInBatch(postStatuses.RECYCLE.value)">删除</a-menu-item>
              </a-menu>
            </template>
            <a-button>
              批量操作
              <a-icon type="down" />
            </a-button>
          </a-dropdown>
          <slot name="operator-after" />
        </a-space>
      </div>

      <div>
        <!-- Mobile -->
        <a-list
          v-if="isMobile()"
          :dataSource="list.data"
          :loading="list.loading"
          :pagination="false"
          itemLayout="vertical"
          size="large"
        >
          <template #renderItem="item, index">
            <a-list-item :key="index">
              <template #actions>
                <span>
                  <a-icon type="eye" />
                  {{ item.visits }}
                </span>
                <span @click="handleOpenPostComments(item)">
                  <a-icon type="message" />
                  {{ item.commentCount }}
                </span>
                <a-dropdown :trigger="['click']" placement="topLeft">
                  <span>
                    <a-icon type="bars" />
                  </span>

                  <template #overlay>
                    <a-menu>
                      <a-menu-item
                        v-if="
                          [
                            postStatuses.PUBLISHED.value,
                            postStatuses.DRAFT.value,
                            postStatuses.INTIMATE.value
                          ].includes(item.status)
                        "
                        @click="handleEditClick(item)"
                      >
                        编辑
                      </a-menu-item>
                      <a-menu-item v-else-if="item.status === postStatuses.RECYCLE.value">
                        <a-popconfirm
                          :title="'确定要发布【' + item.title + '】文章？'"
                          cancelText="取消"
                          okText="确定"
                          @confirm="handleChangeStatus(item.id, postStatuses.PUBLISHED.value)"
                        >
                          还原
                        </a-popconfirm>
                      </a-menu-item>
                      <a-menu-item
                        v-if="
                          [
                            postStatuses.PUBLISHED.value,
                            postStatuses.DRAFT.value,
                            postStatuses.INTIMATE.value
                          ].includes(item.status)
                        "
                      >
                        <a-popconfirm
                          :title="'确定要删除【' + item.title + '】文章？'"
                          cancelText="取消"
                          okText="确定"
                          @confirm="handleChangeStatus(item.id, postStatuses.RECYCLE.value)"
                        >
                          删除
                        </a-popconfirm>
                      </a-menu-item>
                      <a-menu-item v-else-if="item.status === postStatuses.RECYCLE.value">
                        <a-popconfirm
                          :title="'确定要永久删除【' + item.title + '】文章？'"
                          cancelText="取消"
                          okText="确定"
                          @confirm="handleDelete(item.id)"
                        >
                          删除
                        </a-popconfirm>
                      </a-menu-item>
                      <a-menu-item @click="handleOpenPostSettings(item)">设置</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </template>
              <template #extra>
                <a-badge :status="postStatuses[item.status].status" :text="item.status | statusText" />
              </template>
              <a-list-item-meta>
                <template #description>
                  {{ item.createTime | moment }}
                </template>
                <template #title>
                  <div
                    style="
                      max-width: 300px;
                      display: block;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                  >
                    <a-icon
                      v-if="item.topPriority !== 0"
                      style="margin-right: 3px"
                      theme="twoTone"
                      twoToneColor="red"
                      type="pushpin"
                    />
                    <a-tooltip v-if="item.inProgress" placement="top" title="当前有内容已保存，但还未发布。">
                      <a-icon
                        class="cursor-pointer"
                        style="margin-right: 3px"
                        theme="twoTone"
                        twoToneColor="#52c41a"
                        type="info-circle"
                        @click="handleEditClick(item)"
                      />
                    </a-tooltip>
                    <a-tooltip
                      v-if="[postStatuses.PUBLISHED.value, postStatuses.INTIMATE.value].includes(item.status)"
                      :title="'点击访问【' + item.title + '】'"
                      placement="top"
                    >
                      <a :href="item.fullPath" class="no-underline" target="_blank">
                        {{ item.title }}
                      </a>
                    </a-tooltip>
                    <a-tooltip
                      v-else-if="item.status === postStatuses.DRAFT.value"
                      :title="'点击预览【' + item.title + '】'"
                      placement="top"
                    >
                      <a class="no-underline" href="javascript:void(0);" @click="handlePreview(item.id)">
                        {{ item.title }}
                      </a>
                    </a-tooltip>
                    <a v-else class="no-underline" href="javascript:void(0);" disabled>
                      {{ item.title }}
                    </a>
                  </div>
                </template>
              </a-list-item-meta>

              <div v-if="item.summary" class="mb-3 block">
                <span> {{ item.summary }}... </span>
              </div>

              <div class="block">
                <a-tag
                  v-for="(category, categoryIndex) in item.categories"
                  :key="'category_' + categoryIndex"
                  color="blue"
                  style="margin-bottom: 8px"
                >
                  {{ category.name }}
                </a-tag>
              </div>
              <post-tag v-for="(tag, tagIndex) in item.tags" :key="tagIndex" :tag="tag" style="margin-bottom: 8px" />
            </a-list-item>
          </template>
        </a-list>

        <!-- Desktop -->
        <a-table
          v-else
          :columns="columns"
          :dataSource="list.data"
          :loading="list.loading"
          :pagination="false"
          :rowKey="post => post.id"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectionChange
          }"
          :scrollToFirstRowOnChange="true"
        >
          <template #postTitle="text, record">
            <a-icon
              v-if="record.topPriority !== 0"
              style="margin-right: 3px"
              theme="twoTone"
              twoToneColor="red"
              type="pushpin"
            />
            <a-tooltip v-if="record.inProgress" placement="top" title="当前有内容已保存，但还未发布。">
              <a-icon
                class="cursor-pointer"
                style="margin-right: 3px"
                theme="twoTone"
                twoToneColor="#52c41a"
                type="info-circle"
                @click="handleEditClick(record)"
              />
            </a-tooltip>
            <a-tooltip
              v-if="[postStatuses.PUBLISHED.value, postStatuses.INTIMATE.value].includes(record.status)"
              :title="'点击访问【' + text + '】'"
              placement="top"
            >
              <a :href="record.fullPath" class="no-underline" target="_blank">
                {{ text }}
              </a>
            </a-tooltip>
            <a-tooltip
              v-else-if="record.status === postStatuses.DRAFT.value"
              :title="'点击预览【' + text + '】'"
              placement="top"
            >
              <a class="no-underline" href="javascript:void(0);" @click="handlePreview(record.id)">
                {{ text }}
              </a>
            </a-tooltip>
            <a v-else class="no-underline" href="javascript:void(0);" disabled>
              {{ text }}
            </a>
          </template>

          <template #status="status">
            <a-badge :status="postStatuses[status].status" :text="status | statusText" />
          </template>

          <template #categories="categories">
            <a-tag v-for="(category, index) in categories" :key="index" color="blue" style="margin-bottom: 8px">
              {{ category.name }}
            </a-tag>
          </template>

          <template #tags="tags">
            <post-tag v-for="(tag, index) in tags" :key="index" :tag="tag" style="margin-bottom: 8px" />
          </template>

          <template #commentCount="text, record">
            <a-badge
              :count="record.commentCount"
              :numberStyle="{ backgroundColor: '#f38181' }"
              :overflowCount="999"
              :showZero="true"
              class="cursor-pointer"
              @click="handleOpenPostComments(record)"
            />
          </template>

          <template #visits="visits">
            <a-badge
              :count="visits"
              :numberStyle="{ backgroundColor: '#00e0ff' }"
              :overflowCount="9999"
              :showZero="true"
              class="cursor-pointer"
            />
          </template>

          <template #createTime="createTime">
            <a-tooltip placement="top">
              <template #title>
                {{ createTime | moment }}
              </template>
              {{ createTime | timeAgo }}
            </a-tooltip>
          </template>

          <template #action="text, post">
            <a-button
              v-if="
                [postStatuses.PUBLISHED.value, postStatuses.DRAFT.value, postStatuses.INTIMATE.value].includes(
                  post.status
                )
              "
              class="!p-0"
              type="link"
              @click="handleEditClick(post)"
            >
              编辑
            </a-button>

            <a-popconfirm
              v-else-if="post.status === postStatuses.RECYCLE.value"
              :title="'确定要发布【' + post.title + '】文章？'"
              cancelText="取消"
              okText="确定"
              @confirm="handleChangeStatus(post.id, postStatuses.PUBLISHED.value)"
            >
              <a-button class="!p-0" type="link">还原</a-button>
            </a-popconfirm>

            <a-divider type="vertical" />

            <a-popconfirm
              v-if="
                [postStatuses.PUBLISHED.value, postStatuses.DRAFT.value, postStatuses.INTIMATE.value].includes(
                  post.status
                )
              "
              :title="'确定要删除【' + post.title + '】文章？'"
              cancelText="取消"
              okText="确定"
              @confirm="handleChangeStatus(post.id, postStatuses.RECYCLE.value)"
            >
              <a-button class="!p-0" type="link">删除</a-button>
            </a-popconfirm>

            <a-popconfirm
              v-else-if="post.status === postStatuses.RECYCLE.value"
              :title="'确定要永久删除【' + post.title + '】文章？'"
              cancelText="取消"
              okText="确定"
              @confirm="handleDelete(post.id)"
            >
              <a-button class="!p-0" type="link">删除</a-button>
            </a-popconfirm>

            <a-divider type="vertical" />

            <a-button class="!p-0" type="link" @click="handleOpenPostSettings(post)">设置</a-button>
          </template>
        </a-table>
        <div class="page-wrapper">
          <a-pagination
            :current="pagination.page"
            :defaultPageSize="pagination.size"
            :pageSizeOptions="['5', '10', '20', '50', '100']"
            :total="pagination.total"
            class="pagination"
            showLessItems
            showSizeChanger
            @change="handlePageChange"
            @showSizeChange="handlePageSizeChange"
          />
        </div>
      </div>
    </a-card>

    <PostSettingModal
      :loading="postSettingLoading"
      :post="list.selected"
      :savedCallback="onPostSavedCallback"
      :visible.sync="postSettingVisible"
      @onClose="list.selected = {}"
    >
      <template #extraFooter>
        <a-button :disabled="selectPreviousButtonDisabled" @click="handleSelectPrevious"> 上一篇</a-button>
        <a-button :disabled="selectNextButtonDisabled" @click="handleSelectNext"> 下一篇</a-button>
      </template>
    </PostSettingModal>

    <TargetCommentListModal
      :target-id="list.selected.id"
      :title="`「${list.selected.title}」的评论`"
      :visible.sync="postCommentVisible"
      target="post"
      @close="onPostCommentsClose"
    >
      <template #extraFooter>
        <a-button :disabled="selectPreviousButtonDisabled" @click="handleSelectPrevious"> 上一篇</a-button>
        <a-button :disabled="selectNextButtonDisabled" @click="handleSelectNext"> 下一篇</a-button>
      </template>
    </TargetCommentListModal>
  </div>
</template>

<script>
// components
import PostSettingModal from './PostSettingModal.vue'
import TargetCommentListModal from '@/components/Comment/TargetCommentListModal'
import CategorySelectTree from '@/components/Category/CategorySelectTree'

// libs
import { mixinDevice } from '@/mixins/mixin.js'
import { normalPostStatuses, postStatuses } from '@/core/constant'
import apiClient from '@/utils/api-client'

export default {
  name: 'PostListView',
  components: {
    PostSettingModal,
    TargetCommentListModal,
    CategorySelectTree
  },
  mixins: [mixinDevice],
  props: {
    defaultStatuses: {
      type: Array,
      default: () => []
    },
    defaultPageSize: {
      type: Number,
      default: 10
    },
    searchWrapper: {
      type: Boolean,
      default: true
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      postStatuses,
      normalPostStatuses,

      list: {
        data: [],
        loading: false,
        total: 0,
        hasPrevious: false,
        hasNext: false,
        params: {
          page: 0,
          size: 10,
          keyword: undefined,
          categoryId: undefined,
          statuses: []
        },
        selected: {}
      },

      categories: {
        data: [],
        loading: false
      },

      selectedRowKeys: [],
      postSettingVisible: false,
      postSettingLoading: false,
      postCommentVisible: false
    }
  },
  computed: {
    pagination() {
      return {
        page: this.list.params.page + 1,
        size: this.list.params.size,
        total: this.list.total
      }
    },
    selectPreviousButtonDisabled() {
      const index = this.list.data.findIndex(post => post.id === this.list.selected.id)
      return index === 0 && !this.list.hasPrevious
    },
    selectNextButtonDisabled() {
      const index = this.list.data.findIndex(post => post.id === this.list.selected.id)
      return index === this.list.data.length - 1 && !this.list.hasNext
    }
  },
  created() {
    this.list.params.statuses = this.defaultStatuses
    this.list.params.size = this.defaultPageSize
    this.handleListCategories()
  },
  watch: {
    'list.params': {
      deep: true,
      handler: function (newVal) {
        if (newVal) {
          const params = JSON.parse(JSON.stringify(this.list.params))
          this.$emit('change:params', params)
        }
      }
    }
  },
  methods: {
    /**
     * Fetch post data
     */
    async handleListPosts(enableLoading = true) {
      try {
        if (enableLoading) {
          this.list.loading = true
        }

        const { categoryId } = this.list.params
        this.list.params.categoryId = categoryId === 0 ? undefined : categoryId
        const response = await apiClient.post.list(this.list.params)

        this.list.data = response.data.content
        this.list.total = response.data.total
        this.list.hasPrevious = response.data.hasPrevious
        this.list.hasNext = response.data.hasNext
      } catch (error) {
        this.$log.error(error)
      } finally {
        this.list.loading = false
      }
    },

    /**
     * Fetch categories data
     */
    async handleListCategories() {
      try {
        this.categories.loading = true

        const response = await apiClient.category.list({ sort: [], more: true })

        this.categories.data = response.data
      } catch (error) {
        this.$log.error(error)
      } finally {
        this.categories.loading = false
      }
    },

    handleEditClick(post) {
      this.$router.push({ name: 'PostEdit', query: { postId: post.id } })
    },

    onSelectionChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
      this.$log.debug(`SelectedRowKeys: ${selectedRowKeys}`)
    },

    /**
     * Handle page change
     */
    handlePageChange(page = 1) {
      this.list.params.page = page - 1
      this.handleListPosts()
    },

    /**
     * Handle page size change
     */
    handlePageSizeChange(current, size) {
      this.$log.debug(`Current: ${current}, PageSize: ${size}`)
      this.list.params.page = 0
      this.list.params.size = size
      this.handleListPosts()
    },

    /**
     * Reset query params
     */
    handleResetParam() {
      this.list.params.keyword = undefined
      this.list.params.categoryId = undefined
      this.list.params.statuses = this.defaultStatuses
      this.list.params.status = undefined
      this.selectedRowKeys = []
      this.handlePageChange(1)
      this.handleListCategories()
    },

    handleQuery() {
      this.selectedRowKeys = []
      this.handlePageChange(1)
    },

    handleChangeQueryStatus(status) {
      if (status) {
        this.list.params.statuses = [status]
        this.list.params.status = status
      } else {
        this.list.params.statuses = this.defaultStatuses
        this.list.params.status = undefined
      }
      this.handleQuery()
    },

    async handleChangeStatus(postId, status) {
      try {
        await apiClient.post.updateStatusById(postId, status)
        this.$message.success('操作成功！')
      } catch (e) {
        this.$log.error('Failed to change post status', e)
      } finally {
        await this.handleListPosts()
      }
    },

    async handleChangeStatusInBatch(status) {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.info('请至少选择一项！')
        return
      }

      this.$confirm({
        title: '提示',
        content: `确定要将所选的文章转为${postStatuses[status].text}状态吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            await apiClient.post.updateStatusInBatch(this.selectedRowKeys, status)
            this.selectedRowKeys = []
            this.$message.success('操作成功！')
          } catch (e) {
            this.$log.error('Failed to change status in batch', e)
          } finally {
            await this.handleListPosts()
          }
        }
      })
    },

    async handleDelete(postId) {
      try {
        await apiClient.post.delete(postId)
        this.$message.success('删除成功！')
      } catch (e) {
        this.$log.error('Failed to delete post', e)
      } finally {
        await this.handleListPosts()
      }
    },

    async handleDeleteInBatch() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.info('请至少选择一项！')
        return
      }

      this.$confirm({
        title: '提示',
        content: '确定删除所选的文章吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            await apiClient.post.deleteInBatch(this.selectedRowKeys)
            this.selectedRowKeys = []
            this.$message.success('删除成功！')
          } catch (e) {
            this.$log.error('Failed to delete posts in batch', e)
          } finally {
            await this.handleListPosts()
          }
        }
      })
    },

    async handleDeleteCurrentPage() {
      if (!this.list.data.length) {
        this.$message.info('当前页没有文章')
        return
      }
      this.$confirm({
        title: '提示',
        content: '确定删除当前页的所有文章吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            const postIds = this.list.data.map(post => post.id)
            await apiClient.post.deleteInBatch(postIds)
            this.$message.success('删除成功！')
          } catch (e) {
            this.$log.error('Failed to delete posts in batch', e)
          } finally {
            await this.handleListPosts()
          }
        }
      })
    },

    async handleOpenPostSettings(post) {
      try {
        this.postSettingVisible = true
        this.postSettingLoading = true

        const { data } = await apiClient.post.get(post.id)
        this.list.selected = data
      } catch (e) {
        this.$log.error('Failed to open post settings', e)
      } finally {
        this.postSettingLoading = false
      }
    },

    handleOpenPostComments(post) {
      this.list.selected = post
      this.postCommentVisible = true
    },

    handlePreview(postId) {
      apiClient.post.getPreviewLinkById(postId).then(response => {
        window.open(response, '_blank')
      })
    },

    onPostSavedCallback() {
      this.handleListPosts(false)
    },

    onPostCommentsClose() {
      this.postCommentVisible = false
      this.list.selected = {}
      this.handleListPosts(false)
    },

    /**
     * Select previous post
     */
    async handleSelectPrevious() {
      const index = this.list.data.findIndex(post => post.id === this.list.selected.id)
      if (index > 0) {
        this.postSettingLoading = true
        const response = await apiClient.post.get(this.list.data[index - 1].id)
        this.list.selected = response.data
        this.postSettingLoading = false
        return
      }
      if (index === 0 && this.list.hasPrevious) {
        this.list.params.page--
        await this.handleListPosts()
        this.postSettingLoading = true
        const response = await apiClient.post.get(this.list.data[this.list.data.length - 1].id)
        this.list.selected = response.data
        this.postSettingLoading = false
      }
    },

    /**
     * Select next post
     */
    async handleSelectNext() {
      const index = this.list.data.findIndex(post => post.id === this.list.selected.id)
      if (index < this.list.data.length - 1) {
        this.postSettingLoading = true
        const response = await apiClient.post.get(this.list.data[index + 1].id)
        this.list.selected = response.data
        this.postSettingLoading = false
        return
      }
      if (index === this.list.data.length - 1 && this.list.hasNext) {
        this.list.params.page++
        await this.handleListPosts()

        this.postSettingLoading = true
        const response = await apiClient.post.get(this.list.data[0].id)
        this.list.selected = response.data
        this.postSettingLoading = false
      }
    }
  },
  filters: {
    statusText(type) {
      return type ? postStatuses[type].text : ''
    }
  }
}
</script>
