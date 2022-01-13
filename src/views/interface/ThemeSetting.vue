<template>
  <page-view :sub-title="theme.current.version || '-'" :title="theme.current.name || '-'" affix>
    <template slot="extra">
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item key="1">
            <a-icon type="cloud" />
            在线更新
          </a-menu-item>
          <a-menu-item key="2">
            <a-icon type="file" />
            本地更新
          </a-menu-item>
        </a-menu>
        <a-button icon="upload">
          更新
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-button
        :disabled="theme.current.activated"
        icon="delete"
        type="danger"
        @click="themeDeleteModal.visible = true"
      >
        删除
      </a-button>
    </template>
    <a-spin :spinning="theme.loading">
      <div v-if="theme.configurations.length > 0" class="card-container">
        <a-tabs defaultActiveKey="0" type="card">
          <a-tab-pane :key="0" tab="关于"></a-tab-pane>
          <a-tab-pane v-for="(group, index) in theme.configurations" :key="index + 1" :tab="group.label">
            <a-form
              :wrapperCol="{
                xl: { span: 8 },
                lg: { span: 8 },
                sm: { span: 12 },
                xs: { span: 24 }
              }"
              layout="vertical"
            >
              <a-form-item v-for="(item, formItemIndex) in group.items" :key="formItemIndex" :label="item.label + '：'">
                <p v-if="item.description && item.description !== ''" slot="help" v-html="item.description"></p>
                <a-input
                  v-if="item.type === 'TEXT'"
                  v-model="theme.settings[item.name]"
                  :defaultValue="item.defaultValue"
                  :placeholder="item.placeholder"
                />
                <a-input
                  v-else-if="item.type === 'TEXTAREA'"
                  v-model="theme.settings[item.name]"
                  :autoSize="{ minRows: 5 }"
                  :placeholder="item.placeholder"
                  type="textarea"
                />
                <a-radio-group
                  v-else-if="item.type === 'RADIO'"
                  v-model="theme.settings[item.name]"
                  :defaultValue="item.defaultValue"
                >
                  <a-radio v-for="(option, radioIndex) in item.options" :key="radioIndex" :value="option.value">
                    {{ option.label }}
                  </a-radio>
                </a-radio-group>
                <a-select
                  v-else-if="item.type === 'SELECT'"
                  v-model="theme.settings[item.name]"
                  :defaultValue="item.defaultValue"
                >
                  <a-select-option v-for="option in item.options" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </a-select-option>
                </a-select>
                <verte
                  v-else-if="item.type === 'COLOR'"
                  v-model="theme.settings[item.name]"
                  :defaultValue="item.defaultValue"
                  model="hex"
                  picker="square"
                  style="display: inline-block;height: 24px;"
                ></verte>
                <AttachmentInput
                  v-else-if="item.type === 'ATTACHMENT'"
                  v-model="theme.settings[item.name]"
                  :defaultValue="item.defaultValue"
                  :placeholder="item.placeholder"
                />
                <a-input-number
                  v-else-if="item.type === 'NUMBER'"
                  v-model="theme.settings[item.name]"
                  :defaultValue="item.defaultValue"
                  style="width:100%"
                />
                <a-switch
                  v-else-if="item.type === 'SWITCH'"
                  v-model="theme.settings[item.name]"
                  :defaultChecked="item.defaultValue"
                />
                <a-input
                  v-else
                  v-model="theme.settings[item.name]"
                  :defaultValue="item.defaultValue"
                  :placeholder="item.placeholder"
                />
              </a-form-item>
              <a-form-item>
                <ReactiveButton
                  :errored="theme.saveErrored"
                  :loading="theme.saving"
                  erroredText="保存失败"
                  loadedText="保存成功"
                  text="保存"
                  type="primary"
                  @callback="theme.saveErrored = false"
                  @click="handleSaveSettings"
                ></ReactiveButton>
              </a-form-item>
            </a-form>
          </a-tab-pane>
        </a-tabs>
      </div>
      <a-empty v-if="theme.configurations.length <= 0 && !theme.loading" description="当前主题无设置选项" />
    </a-spin>

    <ThemeDeleteConfirmModal
      :theme="theme.current"
      :visible.sync="themeDeleteModal.visible"
      @success="onThemeDeleteSucceed"
    />
  </page-view>
</template>
<script>
// components
import Verte from 'verte'
import 'verte/dist/verte.css'
import { PageView } from '@/layouts'
import ThemeDeleteConfirmModal from './components/ThemeDeleteConfirmModal'
// utils
import apiClient from '@/utils/api-client'

export default {
  name: 'ThemeSetting',
  components: {
    PageView,
    Verte,
    ThemeDeleteConfirmModal
  },
  data() {
    return {
      theme: {
        current: {},
        settings: [],
        configurations: [],
        loading: false,
        saving: false,
        saveErrored: false
      },
      themeDeleteModal: {
        visible: false
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    // Get post id from query
    const themeId = to.query.themeId
    next(async vm => {
      try {
        vm.theme.loading = true
        if (themeId) {
          const { data } = await apiClient.theme.get(themeId)
          vm.theme.current = data
        } else {
          const { data } = await apiClient.theme.getActivatedTheme()
          vm.theme.current = data
        }
        await vm.handleGetConfigurations()
        await vm.handleGetSettings()
      } finally {
        vm.theme.loading = false
      }
    })
  },
  methods: {
    async handleGetConfigurations() {
      try {
        const { data } = await apiClient.theme.listConfigurations(this.theme.current.id)
        this.theme.configurations = data
      } catch (error) {
        this.$log.error(error)
      }
    },
    async handleGetSettings() {
      try {
        const { data } = await apiClient.theme.listSettings(this.theme.current.id)
        this.theme.settings = data
      } catch (error) {
        this.$log.error(error)
      }
    },
    async handleSaveSettings() {
      try {
        this.theme.saving = true
        await apiClient.theme.saveSettings(this.theme.current.id, this.theme.settings)
      } catch (error) {
        this.$log.error(error)
        this.theme.saveErrored = true
      } finally {
        setTimeout(() => {
          this.theme.saving = false
        }, 400)
      }
    },
    onThemeDeleteSucceed() {
      this.$router.replace({ name: 'ThemeList' })
    }
  }
}
</script>
