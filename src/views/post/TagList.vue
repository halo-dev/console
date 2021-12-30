<template>
  <page-view>
    <a-row :gutter="12">
      <a-col :lg="10" :md="10" :sm="24" :xl="10" :xs="24" class="pb-3">
        <a-card :bodyStyle="{ padding: '16px' }" :title="title">
          <a-form-model ref="tagForm" :model="form.model" :rules="form.rules" layout="horizontal">
            <a-form-model-item help="* 页面上所显示的名称" label="名称：" prop="name">
              <a-input v-model="form.model.name" />
            </a-form-model-item>
            <a-form-model-item help="* 一般为单个标签页面的标识，最好为英文" label="别名：" prop="slug">
              <a-input v-model="form.model.slug" />
            </a-form-model-item>
            <a-form-model-item label="颜色：" prop="color">
              <a-input-group compact style="display:flex">
                <a-dropdown :trigger="['click']">
                  <a-input v-model="form.model.color" :maxLength="7" style="flex:1" />
                  <color-picker slot="overlay" :value="colorPicker.colors" @input="onColorPick"></color-picker>
                </a-dropdown>
                <a-button :style="{ backgroundColor: form.model.color }" @click="refreshColor">
                  <a-icon type="sync" :style="{ color: iconColorOfRefresh }" />
                </a-button>
              </a-input-group>
            </a-form-model-item>
            <a-form-model-item help="* 在标签页面可展示，需要主题支持" label="封面图：" prop="thumbnail">
              <a-input v-model="form.model.thumbnail">
                <a slot="addonAfter" href="javascript:void(0);" @click="thumbnailDrawer.visible = true">
                  <a-icon type="picture" />
                </a>
              </a-input>
            </a-form-model-item>
            <a-form-model-item>
              <ReactiveButton
                v-if="!isUpdateMode"
                :errored="form.errored"
                :loading="form.saving"
                erroredText="保存失败"
                loadedText="保存成功"
                text="保存"
                type="primary"
                @callback="handleSavedCallback"
                @click="handleCreateOrUpdateTag"
              ></ReactiveButton>
              <a-button-group v-else>
                <ReactiveButton
                  :errored="form.errored"
                  :loading="form.saving"
                  erroredText="更新失败"
                  loadedText="更新成功"
                  text="更新"
                  type="primary"
                  @callback="handleSavedCallback"
                  @click="handleCreateOrUpdateTag"
                ></ReactiveButton>
                <a-button type="dashed" @click="form.model = {}">返回添加</a-button>
              </a-button-group>
              <a-popconfirm
                v-if="isUpdateMode"
                :title="'你确定要删除【' + form.model.name + '】标签？'"
                cancelText="取消"
                okText="确定"
                @confirm="handleDeleteTag(form.model.id)"
              >
                <a-button class="float-right" type="danger">删除</a-button>
              </a-popconfirm>
            </a-form-model-item>
          </a-form-model>
        </a-card>
      </a-col>
      <a-col :lg="14" :md="14" :sm="24" :xl="14" :xs="24" class="pb-3">
        <a-card :bodyStyle="{ padding: '16px' }" title="所有标签">
          <a-spin :spinning="list.loading">
            <a-empty v-if="list.data.length === 0" />
            <a-tooltip placement="topLeft" v-for="tag in list.data" v-else :key="tag.id">
              <template slot="title">
                <span>{{ tag.postCount }} 篇文章</span>
              </template>
              <post-tag :tag="tag" />
            </a-tooltip>
          </a-spin>
        </a-card>
      </a-col>
    </a-row>

    <AttachmentSelectDrawer
      v-model="thumbnailDrawer.visible"
      title="选择封面图"
      @listenToSelect="handleSelectThumbnail"
    />
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import apiClient from '@/utils/api-client'
import ColorPicker from '@/components/ColorPicker'
import { labelColor, hexRegExp, randomHex } from '@/utils/colorUtil'

const colors = {
  hex: '#194d33',
  hex8: '#194D33A8',
  hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
  hsv: { h: 150, s: 0.66, v: 0.3, a: 1 },
  rgba: { r: 25, g: 77, b: 51, a: 1 },
  a: 1
}

export default {
  components: {
    PageView,
    ColorPicker
  },
  data() {
    return {
      colorPicker: {
        colors: colors
      },
      list: {
        data: [],
        loading: false
      },
      form: {
        model: {},
        saving: false,
        errored: false,
        rules: {
          name: [
            { required: true, message: '* 标签名称不能为空', trigger: ['change'] },
            { max: 255, message: '* 标签名称的字符长度不能超过 255', trigger: ['change'] }
          ],
          slug: [{ max: 255, message: '* 标签别名的字符长度不能超过 255', trigger: ['change'] }],
          thumbnail: [{ max: 1023, message: '* 封面图链接的字符长度不能超过 1023', trigger: ['change'] }],
          color: [{ max: 7, pattern: hexRegExp, message: '仅支持 hex 颜色值' }]
        }
      },
      thumbnailDrawer: {
        visible: false
      }
    }
  },
  computed: {
    title() {
      if (this.isUpdateMode) {
        return '修改标签'
      }
      return '添加标签'
    },
    isUpdateMode() {
      return !!this.form.model.id
    },
    iconColorOfRefresh() {
      return labelColor(this.form.model.color)
    }
  },
  created() {
    this.handleListTags()
    this.refreshColor()
  },
  methods: {
    refreshColor() {
      const color = randomHex()
      this.$set(this.form.model, 'color', color)
    },
    onColorPick(color) {
      this.$set(this.form.model, 'color', color.hex)
    },
    handleListTags() {
      this.list.loading = true
      apiClient.tag
        .list({ more: true })
        .then(response => {
          this.list.data = response.data
        })
        .finally(() => {
          this.list.loading = false
        })
    },
    handleDeleteTag(tagId) {
      apiClient.tag.delete(tagId).finally(() => {
        this.form.model = {}
        this.handleListTags()
        this.refreshColor()
      })
    },
    handleCreateOrUpdateTag() {
      const _this = this
      _this.$refs.tagForm.validate(valid => {
        if (valid) {
          this.form.saving = true
          if (_this.isUpdateMode) {
            apiClient.tag
              .update(_this.form.model.id, _this.form.model)
              .catch(() => {
                this.form.errored = true
              })
              .finally(() => {
                setTimeout(() => {
                  _this.form.saving = false
                }, 400)
              })
          } else {
            apiClient.tag
              .create(_this.form.model)
              .catch(() => {
                this.form.errored = true
              })
              .finally(() => {
                setTimeout(() => {
                  _this.form.saving = false
                }, 400)
              })
          }
        }
      })
    },
    handleSavedCallback() {
      const _this = this
      if (_this.form.errored) {
        _this.form.errored = false
      } else {
        _this.form.model = {}
        _this.refreshColor()
        _this.handleListTags()
      }
    },
    handleSelectThumbnail(data) {
      this.$set(this.form.model, 'thumbnail', encodeURI(data.path))
      this.thumbnailDrawer.visible = false
    }
  }
}
</script>
