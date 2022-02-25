<template>
  <page-view>
    <a-row :gutter="12" align="middle" type="flex">
      <a-col :span="24" class="pb-3">
        <a-card :bodyStyle="{ padding: '16px' }" :bordered="false">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="6" :sm="24">
                  <a-form-item label="关键词：">
                    <a-input v-model="list.params.keyword" />
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="分组：">
                    <a-select v-model="list.params.team" @change="handleQuery()">
                      <a-select-option v-for="(item, index) in computedTeams" :key="index" :value="item">
                        {{ item }}
                      </a-select-option>
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
            <a-button icon="plus" type="primary" @click="handleOpenEditForm({})">添加</a-button>
          </div>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-list
          :dataSource="list.data"
          :grid="{ gutter: 6, xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }"
          :loading="list.loading"
          class="photos-group"
        >
          <template #renderItem="item, index">
            <a-list-item
              :key="index"
              @click="handleOpenEditForm(item)"
              @mouseenter="$set(item, 'hover', true)"
              @mouseleave="$set(item, 'hover', false)"
            >
              <div class="border border-solid">
                <div class="photo-thumb photos-group-item">
                  <span
                    :style="`background-image:url(${encodeURI(item.thumbnail)})`"
                    class="photos-group-item-img"
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
          </template>
        </a-list>
      </a-col>
    </a-row>

    <div class="page-wrapper">
      <a-pagination
        :current="pagination.page"
        :defaultPageSize="pagination.size"
        :pageSizeOptions="['18', '36', '54', '72', '90', '108']"
        :total="pagination.total"
        showLessItems
        showSizeChanger
        @change="handlePageChange"
        @showSizeChange="handlePageSizeChange"
      />
    </div>

    <div style="position: fixed; bottom: 30px; right: 30px">
      <a-button icon="setting" shape="circle" size="large" type="primary" @click="optionFormVisible = true"></a-button>
    </div>

    <a-modal v-model="optionFormVisible" :afterClose="() => (optionFormVisible = false)" title="页面设置">
      <template #footer>
        <a-button key="submit" type="primary" @click="handleSaveOptions()">保存</a-button>
      </template>
      <a-form layout="vertical">
        <a-form-item help="* 需要主题进行适配" label="页面标题：">
          <a-input v-model="options.photos_title" />
        </a-form-item>
        <a-form-item label="每页显示条数：">
          <a-input-number v-model="options.photos_page_size" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>

    <PhotoFormModal
      :photo="list.selected"
      :teams="computedTeams"
      :visible.sync="formVisible"
      @succeed="onSaveSucceed"
    />
  </page-view>
</template>

<script>
// components
import { PageView } from '@/layouts'
import PhotoFormModal from './components/PhotoFormModal'

import { mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/mixins/mixin.js'
import apiClient from '@/utils/api-client'

export default {
  mixins: [mixin, mixinDevice],
  components: { PageView, PhotoFormModal },
  data() {
    return {
      list: {
        data: [],
        loading: false,
        params: {
          page: 0,
          size: 18,
          sort: null,
          keyword: null,
          team: undefined
        },
        total: 0,
        hasPrevious: false,
        hasNext: false,
        selected: {}
      },

      attachmentSelectModal: {
        visible: false
      },

      formVisible: false,

      teams: [],
      options: [],
      optionFormVisible: false
    }
  },
  created() {
    this.handleListPhotos()
    this.handleListPhotoTeams()
    this.handleListOptions()
  },
  computed: {
    pagination() {
      return {
        page: this.list.params.page + 1,
        size: this.list.params.size,
        total: this.list.total
      }
    },
    computedTeams() {
      return this.teams.filter(item => {
        return item !== ''
      })
    }
  },
  methods: {
    ...mapActions(['refreshOptionsCache']),

    async handleListPhotos() {
      try {
        this.list.loading = true

        const response = await apiClient.photo.list(this.list.params)

        this.list.data = response.data.content
        this.list.total = response.data.total
        this.list.hasPrevious = response.data.hasPrevious
        this.list.hasNext = response.data.hasNext
      } catch (e) {
        this.$log.error('Failed to get photos', e)
      } finally {
        this.list.loading = false
      }
    },

    handleListPhotoTeams() {
      apiClient.photo.listTeams().then(response => {
        this.teams = response.data
      })
    },

    /**
     * Handle page change
     */
    handlePageChange(page = 1) {
      this.list.params.page = page - 1
      this.handleListPhotos()
    },

    /**
     * Handle page size change
     */
    handlePageSizeChange(current, size) {
      this.$log.debug(`Current: ${current}, PageSize: ${size}`)
      this.list.params.page = 0
      this.list.params.size = size
      this.handleListPhotos()
    },

    handleQuery() {
      this.handlePageChange(1)
    },

    handleResetParam() {
      this.list.params.keyword = undefined
      this.list.params.team = undefined
      this.handlePageChange(1)
      this.handleListPhotoTeams()
    },

    handleOpenEditForm(photo) {
      this.list.selected = photo
      this.formVisible = true
    },

    onSaveSucceed() {
      this.handleListPhotos()
      this.handleListPhotoTeams()
    },

    handleListOptions() {
      apiClient.option.list().then(response => {
        this.options = response.data
      })
    },

    handleSaveOptions() {
      apiClient.option
        .save(this.options)
        .then(() => {
          this.$message.success('保存成功！')
          this.optionFormVisible = false
        })
        .finally(() => {
          this.handleListOptions()
          this.refreshOptionsCache()
        })
    }
  }
}
</script>
