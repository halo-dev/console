<template>
  <div class="container-wrapper">
    <div class="halo-logo">
      <span>Halo<small>重置密码</small></span>
    </div>
    <div class="animated">
      <a-form layout="vertical">
        <a-form-item>
          <a-input placeholder="用户名" v-model="resetParam.username">
            <template #prefix>
              <UserOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input placeholder="邮箱" v-model="resetParam.email">
            <template #prefix>
              <MailOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input v-model="resetParam.code" type="password" placeholder="验证码">
            <template #prefix>
              <SafetyCertificateOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
            </template>
            <template #addonAfter>
              <a href="javascript:void(0);" @click="handleSendCode"> 获取 </a>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-input v-model="resetParam.password" type="password" placeholder="新密码" autocomplete="new-password">
            <template #prefix>
              <LockOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item :style="{ 'animation-delay': '0.5s' }">
          <a-input
            v-model="resetParam.confirmPassword"
            type="password"
            placeholder="确认密码"
            autocomplete="new-password"
          >
            <template #prefix>
              <LockOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" :block="true" @click="handleResetPassword">重置密码</a-button>
        </a-form-item>

        <a-row>
          <router-link :to="{ name: 'Login' }">
            <a class="tip"> 返回登录 </a>
          </router-link>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script>
import adminApi from '@/api/admin'
import { UserOutlined, MailOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue'

export default {
  components: {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    SafetyCertificateOutlined
  },
  data() {
    return {
      resetParam: {
        username: '',
        email: '',
        code: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    handleSendCode() {
      if (!this.resetParam.username) {
        this.$notification['error']({
          message: '提示',
          description: '用户名不能为空！'
        })
        return
      }
      if (!this.resetParam.email) {
        this.$notification['error']({
          message: '提示',
          description: '邮箱不能为空！'
        })
        return
      }
      const hide = this.$message.loading('发送中...', 0)
      adminApi
        .sendResetCode(this.resetParam)
        .then(() => {
          this.$message.success('邮件发送成功，五分钟内有效')
        })
        .finally(() => {
          hide()
        })
    },
    handleResetPassword() {
      if (!this.resetParam.username) {
        this.$notification['error']({
          message: '提示',
          description: '用户名不能为空！'
        })
        return
      }
      if (!this.resetParam.email) {
        this.$notification['error']({
          message: '提示',
          description: '邮箱不能为空！'
        })
        return
      }
      if (!this.resetParam.code) {
        this.$notification['error']({
          message: '提示',
          description: '验证码不能为空！'
        })
        return
      }
      if (!this.resetParam.password) {
        this.$notification['error']({
          message: '提示',
          description: '新密码不能为空！'
        })
        return
      }
      if (!this.resetParam.confirmPassword) {
        this.$notification['error']({
          message: '提示',
          description: '确认密码不能为空！'
        })
        return
      }
      if (this.resetParam.confirmPassword !== this.resetParam.password) {
        this.$notification['error']({
          message: '提示',
          description: '确认密码和新密码不匹配！'
        })
        return
      }
      adminApi.resetPassword(this.resetParam).then(() => {
        this.$message.success('密码重置成功！')
        this.$router.push({ name: 'Login' })
      })
    }
  }
}
</script>
