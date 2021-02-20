<template>
  <div>
    <a-row
      type="flex"
      justify="center"
      align="middle"
      class="h-screen"
    >
      <a-col
        :xxl="8"
        :xl="12"
        :lg="16"
        :md="20"
        :sm="20"
        :xs="22"
      >
        <div class="card-container">
          <a-card
            :bordered="false"
            style="box-shadow: -4px 7px 46px 2px rgba(0, 0, 0, 0.1);"
          >
            <div class="halo-logo">
              <span>Halo
                <small>安装向导</small>
              </span>
            </div>
            <a-alert
              message="欢迎使用 Halo，您正在安装的是 Halo 1.4.5。"
              type="success"
              show-icon
            />
            <!-- Blogger info -->
            <div class="mt-5 mb-5">
              <a-radio-group v-model="installationType">
                <a-radio-button value="new">
                  全新安装
                </a-radio-button>
                <a-radio-button value="import">
                  数据导入
                </a-radio-button>
              </a-radio-group>
            </div>
            <a-form-model
              class="installationForm"
              ref="installationForm"
              :model="form.model"
              :rules="form.rules"
              layout="horizontal"
            >
              <a-divider
                orientation="left"
                dashed
              >
                管理员信息
              </a-divider>
              <a-form-model-item prop="username">
                <a-input
                  v-model="form.model.username"
                  placeholder="用户名"
                >
                  <a-icon
                    slot="prefix"
                    type="user"
                    style="color: rgba(0,0,0,.25)"
                  />
                </a-input>
              </a-form-model-item>
              <a-form-model-item prop="email">
                <a-input
                  v-model="form.model.email"
                  placeholder="用户邮箱"
                >
                  <a-icon
                    slot="prefix"
                    type="mail"
                    style="color: rgba(0,0,0,.25)"
                  />
                </a-input>
              </a-form-model-item>
              <a-form-model-item prop="password">
                <a-input
                  v-model="form.model.password"
                  type="password"
                  placeholder="登录密码（8-100位）"
                >
                  <a-icon
                    slot="prefix"
                    type="lock"
                    style="color: rgba(0,0,0,.25)"
                  />
                </a-input>
              </a-form-model-item>
              <a-form-model-item prop="confirmPassword">
                <a-input
                  v-model="form.model.confirmPassword"
                  type="password"
                  placeholder="确认密码"
                >
                  <a-icon
                    slot="prefix"
                    type="lock"
                    style="color: rgba(0,0,0,.25)"
                  />
                </a-input>
              </a-form-model-item>
              <a-divider
                orientation="left"
                dashed
              >
                站点信息
              </a-divider>
              <a-form-model-item prop="url">
                <a-input
                  v-model="form.model.url"
                  placeholder="博客地址"
                >
                  <a-icon
                    slot="prefix"
                    type="link"
                    style="color: rgba(0,0,0,.25)"
                  />
                </a-input>
              </a-form-model-item>
              <a-form-model-item prop="title">
                <a-input
                  v-model="form.model.title"
                  placeholder="博客标题"
                >
                  <a-icon
                    slot="prefix"
                    type="book"
                    style="color: rgba(0,0,0,.25)"
                  />
                </a-input>
              </a-form-model-item>
            </a-form-model>
            <!-- Data migration -->
            <div v-if="false">
              <a-alert
                style="margin-bottom: 1rem"
                message="如果有数据导入需求，请点击并选择之前导出的文件。需要注意的是，并不是所有数据都会导入，该初始化表单的数据会覆盖你导入的数据。"
                type="info"
              />
              <FilePondUpload
                ref="upload"
                name="file"
                accept="application/json"
                label="拖拽或点击选择数据文件，请确认是否为 Halo 后台导出的文件。"
                :multiple="false"
                :uploadHandler="handleMigrationUpload"
                :loadOptions="false"
              ></FilePondUpload>
            </div>

            <div class="mt-5">
              <a-button
                type="primary"
                icon="check"
                block
                size="large"
                @click="handleInstall"
                :loading="form.installing"
              >安装</a-button>
            </div>
          </a-card>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import adminApi from '@/api/admin'
import migrateApi from '@/api/migrate'
import { mapActions } from 'vuex'

export default {
  data() {
    const confirmPasswordValidate = (rule, value, callback) => {
      if (value !== this.form.model.password) {
        callback(new Error('确认密码与所输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      migrationData: null,
      installationType: 'new', // new or import
      form: {
        model: {},
        rules: {
          username: [
            { required: true, message: '* 用户名不能为空', trigger: ['change'] },
            { max: 50, message: '* 用户名的字符长度不能超过 50', trigger: ['change'] },
          ],
          nickname: [
            { required: true, message: '* 用户昵称不能为空', trigger: ['change'] },
            { max: 255, message: '* 用户昵称的字符长度不能超过 255', trigger: ['change'] },
          ],
          email: [
            { required: true, message: '* 电子邮件地址不能为空', trigger: ['change'] },
            { max: 127, message: '* 电子邮件地址的字符长度不能超过 127', trigger: ['change'] },
            {
              pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/g,
              message: '* 电子邮件地址的格式不正确',
              trigger: ['change'],
            },
          ],
          password: [
            { required: true, message: '* 密码不能为空', trigger: ['change'] },
            { min: 8, max: 100, message: '* 密码的字符长度必须在 8 - 100 之间', trigger: ['change'] },
          ],
          confirmPassword: [
            { required: true, message: '* 确认密码不能为空', trigger: ['change'] },
            { validator: confirmPasswordValidate, trigger: ['change'] },
          ],
          url: [{ required: true, message: '* 博客地址不能为空', trigger: ['change'] }],
          title: [{ required: true, message: '* 博客标题不能为空', trigger: ['change'] }],
        },
        installing: false,
      },
    }
  },
  beforeMount() {
    this.handleVerifyIsInstall()
    this.$set(this.form.model, 'url', window.location.protocol + '//' + window.location.host)
  },
  methods: {
    ...mapActions(['installCleanToken']),
    async handleVerifyIsInstall() {
      await adminApi.isInstalled().then((response) => {
        if (response.data.data) {
          this.$router.push({ name: 'Login' })
        }
      })
    },
    handleMigrationUpload(data) {
      this.$log.debug('Selected data', data)
      this.migrationData = data
      return new Promise((resolve, reject) => {
        this.$log.debug('Handle uploading')
        resolve()
      })
    },
    install() {
      this.installCleanToken(this.form.model)
        .then((response) => {
          this.$log.debug('Installation response', response)
          this.$message.success('安装成功！')
          setTimeout(() => {
            this.$router.push({ name: 'Login' })
          }, 200)
        })
        .finally(() => {
          setTimeout(() => {
            this.form.installing = false
          }, 400)
        })
    },
    handleInstall() {
      this.form.installing = true
      if (this.migrationData) {
        const hide = this.$message.loading('数据导入中...', 0)
        migrateApi
          .migrate(this.migrationData)
          .then((response) => {
            this.$log.debug('Migrated successfullly')
            this.$message.success('数据导入成功！')
            this.install()
          })
          .finally(() => {
            hide()
          })
      } else {
        this.install()
      }
    },
  },
}
</script>
<style lang="less" scoped>
::v-deep .installationForm {
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
