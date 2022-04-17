<template>
  <div v-if="theme.id" class="card-container h-full">
    <a-tabs class="h-full" defaultActiveKey="0" type="card">
      <a-tab-pane :key="0" tab="关于">
        <div v-if="theme.logo">
          <a-avatar :alt="theme.name" :size="72" :src="theme.logo" shape="square" />
          <a-divider />
        </div>
        <a-descriptions :column="1" layout="horizontal">
          <a-descriptions-item label="作者">
            <a :href="theme.author.website || '#'" class="text-inherit" target="_blank">
              {{ theme.author.name }}
            </a>
          </a-descriptions-item>
          <a-descriptions-item label="介绍">
            {{ theme.description || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="官网">
            <a :href="theme.website || '#'" class="text-inherit" target="_blank">
              {{ theme.website || '-' }}
            </a>
          </a-descriptions-item>
          <a-descriptions-item label="Git 仓库">
            <a :href="theme.repo || '#'" class="text-inherit" target="_blank">
              {{ theme.repo || '-' }}
            </a>
          </a-descriptions-item>
          <a-descriptions-item label="主题标识">
            {{ theme.id }}
          </a-descriptions-item>
          <a-descriptions-item label="当前版本">
            {{ theme.version }}
          </a-descriptions-item>
          <a-descriptions-item label="存储位置">
            {{ theme.themePath }}
          </a-descriptions-item>
          <slot name="descriptions-item" />
        </a-descriptions>
      </a-tab-pane>
      <a-tab-pane v-for="(group, index) in form.configurations" :key="index + 1" :tab="group.label">
        <a-form :wrapperCol="wrapperCol" layout="vertical">
          <a-form-item v-for="(item, formItemIndex) in group.items" :key="formItemIndex" :label="item.label + '：'">
            <p v-if="item.description && item.description !== ''" slot="help" v-html="item.description"></p>
            <a-input
              v-if="item.type === 'TEXT'"
              v-model="form.settings[item.name]"
              :defaultValue="item.defaultValue"
              :placeholder="item.placeholder"
            />
            <a-input
              v-else-if="item.type === 'TEXTAREA'"
              v-model="form.settings[item.name]"
              :autoSize="{ minRows: 5 }"
              :placeholder="item.placeholder"
              type="textarea"
            />
            <a-radio-group
              v-else-if="item.type === 'RADIO'"
              v-model="form.settings[item.name]"
              :defaultValue="item.defaultValue"
            >
              <a-radio v-for="(option, radioIndex) in item.options" :key="radioIndex" :value="option.value">
                {{ option.label }}
              </a-radio>
            </a-radio-group>
            <a-select
              v-else-if="item.type === 'SELECT'"
              v-model="form.settings[item.name]"
              :defaultValue="item.defaultValue"
            >
              <a-select-option v-for="option in item.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </a-select-option>
            </a-select>
            <verte
              v-else-if="item.type === 'COLOR'"
              v-model="form.settings[item.name]"
              :defaultValue="item.defaultValue"
              model="hex"
              picker="square"
              style="display: inline-block; height: 24px"
            ></verte>
            <AttachmentInput
              v-else-if="item.type === 'ATTACHMENT'"
              v-model="form.settings[item.name]"
              :defaultValue="item.defaultValue"
              :placeholder="item.placeholder"
            />
            <a-input-number
              v-else-if="item.type === 'NUMBER'"
              v-model="form.settings[item.name]"
              :defaultValue="item.defaultValue"
              style="width: 100%"
            />
            <a-switch
              v-else-if="item.type === 'SWITCH'"
              v-model="form.settings[item.name]"
              :defaultChecked="item.defaultValue"
            />
            <a-input
              v-else
              v-model="form.settings[item.name]"
              :defaultValue="item.defaultValue"
              :placeholder="item.placeholder"
            />
          </a-form-item>
          <a-form-item>
            <ReactiveButton
              :errored="form.saveErrored"
              :loading="form.saving"
              erroredText="保存失败"
              loadedText="保存成功"
              text="保存"
              type="primary"
              @callback="handleSaveSettingsCallback"
              @click="handleSaveSettings"
            ></ReactiveButton>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
// components
import Verte from 'verte'
import 'verte/dist/verte.css'

import apiClient from '@/utils/api-client'

export default {
  name: 'ThemeSettingForm',
  components: {
    Verte
  },
  props: {
    theme: {
      type: Object,
      default: () => {}
    },
    wrapperCol: {
      type: Object,
      default: () => {
        return {
          xl: { span: 8 },
          lg: { span: 8 },
          sm: { span: 12 },
          xs: { span: 24 }
        }
      }
    }
  },
  data() {
    return {
      form: {
        settings: [],
        configurations: [],
        loading: false,
        saving: false,
        saveErrored: false
      }
    }
  },
  watch: {
    theme(value) {
      if (value) {
        this.handleGetConfigurations()
      }
    }
  },
  methods: {
    async handleGetConfigurations() {
      try {
        const { data } = await apiClient.theme.listConfigurations(this.theme.id)
        this.form.configurations = data

        await this.handleGetSettings()
      } catch (error) {
        this.$log.error(error)
      }
    },
    async handleGetSettings() {
      try {
        const { data } = await apiClient.theme.listSettings(this.theme.id)
        this.form.settings = data
      } catch (error) {
        this.$log.error(error)
      }
    },
    async handleSaveSettings(enableLoading = true) {
      try {
        if (enableLoading) {
          this.form.saving = true
        }
        await apiClient.theme.saveSettings(this.theme.id, this.form.settings)
      } catch (error) {
        this.$log.error(error)
        this.form.saveErrored = true
        throw new Error(error)
      } finally {
        setTimeout(() => {
          this.form.saving = false
        }, 400)
      }
    },
    handleSaveSettingsCallback() {
      if (this.form.saveErrored) {
        this.form.saveErrored = false
      } else {
        this.handleGetSettings()
        this.$emit('saved')
      }
    }
  }
}
</script>
