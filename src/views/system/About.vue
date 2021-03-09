<template>
  <page-view>
    <a-row>
      <a-col :span="24">
        <a-card :bordered="false" :bodyStyle="{ padding: '16px' }">
          <a-card :bordered="false" class="environment-info" :bodyStyle="{ padding: '16px' }">
            <template #title>
              环境信息
              <a href="javascript:void(0);" @click="handleCopyEnvironments">
                <CopyOutlined />
              </a>
            </template>
            <template #extra>
              <a-popover placement="left" :title="isLatest ? '当前为最新版本' : '有新版本'">
                <template #content>
                  <p>{{ versionMessage }}</p>
                  <a-button type="dashed" @click="handleShowVersionContent">查看详情</a-button>
                </template>
                <a-button :loading="checking" type="dashed" shape="circle">
                  <template #icon>
                    <CheckCircleOutlined v-if="isLatest" />
                    <ExclamationCircleOutlined v-else />
                  </template>
                </a-button>
              </a-popover>
            </template>

            <ul class="p-0 m-0 list-none">
              <li>版本：{{ environments.version }}</li>
              <li>数据库：{{ environments.database }}</li>
              <li>运行模式：{{ environments.mode }}</li>
              <li>启动时间：{{ environments.startTime }}</li>
            </ul>
            <a href="https://halo.run" target="_blank" class="mr-3"
              >官网
              <a-icon type="link" />
            </a>
            <a href="https://docs.halo.run" target="_blank" class="mr-3"
              >文档
              <a-icon type="link" />
            </a>
            <a href="https://github.com/halo-dev" target="_blank" class="mr-3"
              >开源组织
              <a-icon type="link" />
            </a>
            <a href="https://bbs.halo.run" target="_blank" class="mr-3"
              >在线社区
              <a-icon type="link" />
            </a>
          </a-card>

          <a-card title="开发者" :bordered="false" :bodyStyle="{ padding: '16px' }" :loading="contributorsLoading">
            <a :href="item.html_url" v-for="(item, index) in contributors" :key="index" target="_blank">
              <a-tooltip placement="top" :title="item.login">
                <a-avatar size="large" :src="item.avatar_url" :style="{ marginRight: '10px', marginBottom: '10px' }" />
              </a-tooltip>
            </a>
          </a-card>
        </a-card>
      </a-col>
    </a-row>

    <a-modal
      :title="versionContentModalTitle"
      :visible="versionContentVisible"
      ok-text="查看更多"
      @cancel="versionContentVisible = false"
      @ok="handleOpenVersionUrl"
      :width="620"
    >
      <div v-html="versionContent"></div>
    </a-modal>
  </page-view>
</template>

<script>
import adminApi from '@/api/admin'
import axios from 'axios'
import marked from 'marked'
import { PageView } from '@/layouts'

import { defineComponent, reactive, ref, computed, h, onMounted } from 'vue'
import { useClipboard } from '@vueuse/core'
import { message, notification, Button } from 'ant-design-vue'
import { CopyOutlined, CheckCircleOutlined, ExclamationCircleOutlined, SmileOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  components: {
    CopyOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    PageView
  },
  setup() {
    let environments = ref({
      database: null,
      mode: null,
      startTime: null,
      version: null
    })
    let latestData = ref({})
    let contributors = ref([
      {
        login: '',
        id: 0,
        node_id: '',
        avatar_url: '',
        gravatar_id: '',
        url: '',
        html_url: '',
        followers_url: '',
        following_url: '',
        gists_url: '',
        starred_url: '',
        subscriptions_url: '',
        organizations_url: '',
        repos_url: '',
        events_url: '',
        received_events_url: '',
        type: '',
        site_admin: false,
        contributions: 0
      }
    ])

    let contributorsLoading = ref(false)
    let checking = ref(false)
    let isLatest = ref(false)
    let versionContentVisible = ref(false)

    const versionMessage = computed(() => {
      return `当前版本：${environments.value.version}，${
        isLatest.value ? '已经是最新版本。' : `新版本：${latestData.value.name}，你可以点击下方按钮查看详情。`
      }`
    })

    const versionContent = computed(() => {
      if (latestData.value && latestData.value.body) {
        return marked(latestData.value.body)
      }
      return '暂无内容'
    })

    const versionContentModalTitle = computed(() => {
      return `${latestData.value.name} 更新内容`
    })

    const getEnvironments = async () => {
      const response = await adminApi.environments()
      environments.value = response.data.data
      handleCheckServerUpdate()
    }

    getEnvironments()

    const handleCopyEnvironments = () => {
      const { copy, isSupported } = useClipboard()

      if (!isSupported) {
        message.warning('当前浏览器不支持复制')
        return
      }

      const text = `版本：${environments.value.version}
数据库：${environments.value.database}
运行模式：${environments.value.mode}
User Agent：${navigator.userAgent}`

      copy(text)
        .then(() => {
          message.success('复制成功！')
        })
        .catch(() => {
          message.error('复制失败！')
        })
    }

    const handleFetchContributors = () => {
      contributorsLoading.value = true
      axios
        .get('https://api.github.com/repos/halo-dev/halo/contributors')
        .then(response => {
          contributors.value = response.data
        })
        .catch(function(error) {
          console.log('Fetch contributors error', error)
        })
        .finally(() => {
          setTimeout(() => {
            contributorsLoading.value = false
          }, 200)
        })
    }

    handleFetchContributors()

    const handleCheckServerUpdate = () => {
      checking.value = true
      axios
        .get('https://api.github.com/repos/halo-dev/halo/releases/latest')
        .then(response => {
          const data = response.data
          latestData.value = data
          if (data.draft || data.prerelease) {
            return
          }
          const current = calculateIntValue(environments.value.version)
          const latest = calculateIntValue(data.name)
          if (current >= latest) {
            isLatest.value = true
            return
          }
          const title = '新版本提醒'
          const content = '检测到 Halo 新版本：' + data.name + '，点击下方按钮查看最新版本。'
          notification.open({
            message: title,
            description: content,
            icon: h(SmileOutlined, { style: 'color: #108ee9' }),
            btn: h(
              Button,
              {
                type: 'primary',
                size: 'small',
                onClick: () => handleShowVersionContent()
              },
              '查看'
            )
          })
        })
        .catch(function(error) {
          console.log('Check update fail', error)
        })
        .finally(() => {
          setTimeout(() => {
            checking.value = false
          }, 200)
        })
    }

    const handleShowVersionContent = () => {
      versionContentVisible.value = true
    }

    const handleOpenVersionUrl = () => {
      window.open(latestData.value.html_url, '_blank')
    }

    const calculateIntValue = version => {
      version = version.replace(/v/g, '')
      const ss = version.split('.')
      if (ss == null || ss.length !== 3) {
        return -1
      }
      const major = parseInt(ss[0])
      const minor = parseInt(ss[1])
      const micro = parseInt(ss[2])
      if (isNaN(major) || isNaN(minor) || isNaN(micro)) {
        return -1
      }
      return major * 1000000 + minor * 1000 + micro
    }

    return {
      environments,
      latestData,
      contributors,
      contributorsLoading,
      checking,
      isLatest,
      versionContentVisible,
      versionMessage,
      versionContent,
      versionContentModalTitle,
      handleCopyEnvironments,
      handleShowVersionContent,
      handleOpenVersionUrl
    }
  }
})
</script>
