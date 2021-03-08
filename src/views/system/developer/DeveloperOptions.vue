<template>
  <page-view>
    <a-row>
      <a-col :span="24">
        <div class="card-container" v-if="options.developer_mode">
          <a-tabs type="card">
            <a-tab-pane key="environment">
              <template #tab>
                <span> <a-icon type="safety" />运行环境 </span>
              </template>
              <Environment />
            </a-tab-pane>
            <a-tab-pane key="runtimeLogs">
              <template #tab>
                <span> <a-icon type="code" />实时日志 </span>
              </template>
              <RuntimeLogs />
            </a-tab-pane>
            <a-tab-pane key="optionsList">
              <template #tab>
                <span> <a-icon type="table" />系统变量 </span>
              </template>
              <OptionsList />
            </a-tab-pane>
            <a-tab-pane key="staticStorage">
              <template #tab>
                <span> <a-icon type="cloud" />静态存储 </span>
              </template>
              <StaticStorage />
            </a-tab-pane>
            <a-tab-pane key="settings">
              <template #tab>
                <span> <a-icon type="setting" />设置 </span>
              </template>
              <SettingsForm />
            </a-tab-pane>
          </a-tabs>
        </div>
        <a-alert
          v-else
          message="提示"
          description="当前没有启用开发者选项，请启用之后再访问该页面！"
          type="error"
          showIcon
        />
      </a-col>
    </a-row>
  </page-view>
</template>
<script>
import { mapGetters } from 'vuex'
import { PageView } from '@/layouts'
import Environment from './tabs/Environment'
import RuntimeLogs from './tabs/RuntimeLogs'
import SettingsForm from './tabs/SettingsForm'
import OptionsList from './tabs/OptionsList'
import StaticStorage from './tabs/StaticStorage'
export default {
  components: {
    PageView,
    Environment,
    RuntimeLogs,
    SettingsForm,
    OptionsList,
    StaticStorage
  },
  computed: {
    ...mapGetters(['options'])
  }
}
</script>
