<template>
  <a-row type="flex" justify="center" align="middle" class="h-screen">
    <a-col :xxl="8" :xl="12" :lg="16" :md="20" :sm="20" :xs="23">
      <div class="card-container animated fadeIn">
        <a-card :bordered="false" style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
          <div class="halo-logo">
            <span
              >Halo
              <small>安装向导</small>
            </span>
          </div>
          <a-alert :message="`欢迎使用 Halo，您正在安装的是 Halo ${app_version}。`" type="success" show-icon />
          <!-- Blogger info -->
          <div class="mt-5 mb-5">
            <a-radio-group v-model:value="installationMode">
              <a-radio-button value="new">
                全新安装
              </a-radio-button>
              <a-radio-button value="import">
                数据导入
              </a-radio-button>
            </a-radio-group>
          </div>
          <a-form
            class="installationForm animated fadeIn"
            layout="horizontal"
            v-show="isInstallMode"
            :wrapperCol="{ span: 24 }"
          >
            <a-divider orientation="left" dashed>
              管理员信息
            </a-divider>
            <a-form-item name="username" v-bind="validateInfos.username">
              <a-input v-model:value="model.username" placeholder="用户名">
                <template #prefix>
                  <UserOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item name="nickname" v-bind="validateInfos.nickname">
              <a-input v-model:value="model.nickname" placeholder="用户昵称">
                <template #prefix>
                  <UserOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item name="email" v-bind="validateInfos.email">
              <a-input v-model:value="model.email" placeholder="用户邮箱">
                <template #prefix>
                  <MailOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item name="password" v-bind="validateInfos.password">
              <a-input v-model:value="model.password" type="password" placeholder="登录密码（8-100位）">
                <template #prefix>
                  <LockOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item name="confirmPassword" v-bind="validateInfos.confirmPassword">
              <a-input v-model:value="model.confirmPassword" type="password" placeholder="确认登录密码">
                <template #prefix>
                  <LockOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
                </template>
              </a-input>
            </a-form-item>
            <a-divider orientation="left" dashed>
              站点信息
            </a-divider>
            <a-form-item name="url" v-bind="validateInfos.url">
              <a-input v-model:value="model.url" placeholder="博客地址">
                <template #prefix>
                  <LinkOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item name="title" v-bind="validateInfos.title">
              <a-input v-model:value="model.title" placeholder="博客标题">
                <template #prefix>
                  <BookOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
                </template>
              </a-input>
            </a-form-item>
          </a-form>

          <!-- Data migration -->
          <div class="animated fadeIn" v-show="isImportMode">
            <FilePondUpload
              ref="upload"
              name="file"
              :accepts="['application/json']"
              label="拖拽或点击选择数据文件<br>请确认是否为 Halo 后台导出的文件。"
              :multiple="false"
              :uploadHandler="onImportUpload"
            ></FilePondUpload>
          </div>

          <div class="mt-8">
            <ReactiveButton
              v-if="isInstallMode"
              icon="check"
              type="primary"
              block
              size="large"
              @onClick="handleInstall"
              @callback="handleInstallCallback"
              :loading="installing"
              :errored="installErrored"
              text="安装"
              loadedText="安装成功"
              erroredText="安装失败"
            >
              <template #icon>
                <CheckOutlined />
              </template>
            </ReactiveButton>
            <ReactiveButton
              v-if="isImportMode"
              icon="import"
              type="primary"
              block
              size="large"
              @onClick="handleImport"
              @callback="handleImportCallback"
              :loading="importing"
              :errored="importErrored"
              text="导入"
              loadedText="导入成功"
              erroredText="导入失败"
            >
              <template #icon>
                <ImportOutlined />
              </template>
            </ReactiveButton>
          </div>
        </a-card>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import adminApi from '@/api/admin'
import migrateApi from '@/api/migrate'

import { defineComponent, reactive, ref, computed, onBeforeMount, inject } from 'vue'
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  LinkOutlined,
  BookOutlined,
  CheckOutlined,
  ImportOutlined
} from '@ant-design/icons-vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useForm } from '@ant-design-vue/use'
import { message } from 'ant-design-vue'
export default defineComponent({
  components: {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    LinkOutlined,
    BookOutlined,
    CheckOutlined,
    ImportOutlined
  },
  setup() {
    const store = useStore()

    const router = useRouter()

    const installCleanToken = model => store.dispatch('installCleanToken', model)

    const app_version = inject('app_version')

    const model = reactive({
      email: null,
      nickname: null,
      password: null,
      title: null,
      url: null,
      username: null,
      confirmPassword: null
    })

    const installationMode = ref('new') // new or import

    const installing = ref(false)

    const installErrored = ref(false)

    const importing = ref(false)

    const importErrored = ref(false)

    const importData = ref(null)

    const isInstallMode = computed(() => {
      return installationMode.value === 'new'
    })

    const isImportMode = computed(() => {
      return installationMode.value === 'import'
    })

    const confirmPasswordValidate = async (rule, value) => {
      if (value !== model.password) {
        return Promise.reject('* 确认密码与所输入的密码不一致')
      }
      return Promise.resolve()
    }

    const rules = reactive({
      username: [
        { required: true, message: '* 用户名不能为空', trigger: ['change'] },
        { max: 50, message: '* 用户名的字符长度不能超过 50', trigger: ['change'] }
      ],
      nickname: [
        { required: true, message: '* 用户昵称不能为空', trigger: ['change'] },
        { max: 255, message: '* 用户昵称的字符长度不能超过 255', trigger: ['change'] }
      ],
      email: [
        { required: true, message: '* 电子邮件地址不能为空', trigger: ['change'] },
        { max: 127, message: '* 电子邮件地址的字符长度不能超过 127', trigger: ['change'] },
        {
          pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/g,
          message: '* 电子邮件地址的格式不正确',
          trigger: ['change']
        }
      ],
      password: [
        { required: true, message: '* 密码不能为空', trigger: ['change'] },
        { min: 8, max: 100, message: '* 密码的字符长度必须在 8 - 100 之间', trigger: ['change'] }
      ],
      confirmPassword: [
        { required: true, message: '* 确认密码不能为空', trigger: ['change'] },
        { validator: confirmPasswordValidate, trigger: ['change'] }
      ],
      url: [{ required: true, message: '* 博客地址不能为空', trigger: ['change'] }],
      title: [{ required: true, message: '* 博客标题不能为空', trigger: ['change'] }]
    })

    const { validate, validateInfos } = useForm(model, rules)

    const handleVerifyIsInstall = async () => {
      const response = await adminApi.isInstalled()
      if (response.data.data) {
        router.push({ name: 'Login' })
      }
    }

    const handleInstall = () => {
      validate().then(() => {
        installing.value = true
        installCleanToken(model)
          .then(response => {
            console.log('Installation response', response)
          })
          .catch(() => {
            installErrored.value = true
          })
          .finally(() => {
            setTimeout(() => {
              installing.value = false
            }, 400)
          })
      })
    }

    const handleInstallCallback = () => {
      if (installErrored.value) {
        installErrored.value = false
      } else {
        message.success('安装成功！')
        router.push({ name: 'Login' })
      }
    }

    const onImportUpload = data => {
      console.log('Selected data', data)
      importData.value = data
      return new Promise(resolve => {
        console.log('Handle uploading')
        resolve()
      })
    }

    const handleImport = () => {
      if (!importData.value) {
        message.warning('请先上传数据文件！')
        return
      }
      importing.value = true
      migrateApi
        .migrate(importData.value)
        .then(() => {
          console.log('Migrated successfullly')
        })
        .catch(() => {
          importErrored.value = true
        })
        .finally(() => {
          setTimeout(() => {
            importing.value = false
          }, 400)
        })
    }

    const handleImportCallback = () => {
      if (importErrored.value) {
        importErrored.value = false
      } else {
        message.success('导入成功！')
        router.push({ name: 'Login' })
      }
    }

    onBeforeMount(() => {
      handleVerifyIsInstall()
    })

    return {
      app_version,
      model,
      rules,
      installationMode,
      isInstallMode,
      isImportMode,
      validateInfos,
      installing,
      installErrored,
      importing,
      importErrored,
      onImportUpload,
      handleInstall,
      handleInstallCallback,
      handleImport,
      handleImportCallback
    }
  }
})
</script>
<style lang="less" scoped>
:deep .installationForm {
  .ant-divider {
    .ant-divider-inner-text {
      padding-left: 0;
    }
    &::before {
      width: 0;
    }
  }
}
</style>
