<template>
  <a-form layout="vertical" @keyup.enter="handleLogin">
    <a-form-item v-if="!needAuthCode" v-bind="validateInfos.username">
      <a-input placeholder="用户名/邮箱" v-model:value="model.username">
        <template #prefix>
          <UserOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item v-if="!needAuthCode" v-bind="validateInfos.password">
      <a-input type="password" placeholder="密码" v-model:value="model.password">
        <template #prefix>
          <LockOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item v-if="needAuthCode" v-bind="validateInfos.authcode">
      <a-input placeholder="两步验证码" v-model:value="model.authcode" :maxLength="6">
        <template #prefix>
          <SafetyCertificateOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button
        :loading="logging"
        type="primary"
        :block="true"
        @click="needAuthCode ? handleLogin() : handleLoginClick()"
        >{{ buttonName }}</a-button
      >
    </a-form-item>
  </a-form>
</template>

<script>
import adminApi from '@/api/admin'

import { defineComponent, reactive, ref, computed } from 'vue'
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue'
import { useForm } from '@ant-design-vue/use'
import { useStore } from 'vuex'
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
    SafetyCertificateOutlined
  },
  setup(props, { emit }) {
    const store = useStore()

    const login = (username, password, authcode) => store.dispatch('login', { username, password, authcode })

    const model = reactive({
      authcode: null,
      password: null,
      username: null
    })

    let needAuthCode = ref(false)
    let logging = ref(false)

    const authcodeValidate = async (rule, value) => {
      if (!value && needAuthCode.value) {
        return Promise.reject('* 请输入两步验证码')
      }
      return Promise.resolve()
    }

    const rules = reactive({
      username: [{ required: true, message: '* 用户名/邮箱不能为空', trigger: ['change'] }],
      password: [{ required: true, message: '* 密码不能为空', trigger: ['change'] }],
      authcode: [{ validator: authcodeValidate, trigger: ['change'] }]
    })

    const buttonName = computed(() => {
      return needAuthCode.value ? '验证' : '登录'
    })

    const { validate, validateInfos } = useForm(model, rules)

    const handleLoginClick = () => {
      validate().then(() => {
        logging.value = true
        adminApi
          .loginPreCheck(model.username, model.password)
          .then(response => {
            const data = response.data.data
            if (data && data.needMFACode) {
              needAuthCode.value = true
              model.authcode = null
            } else {
              handleLogin()
            }
          })
          .finally(() => {
            setTimeout(() => {
              logging.value = false
            }, 300)
          })
      })
    }

    const handleLogin = () => {
      validate().then(() => {
        logging.value = true
        login(model.username, model.password, model.authcode)
          .then(() => {
            emit('success')
          })
          .finally(() => {
            setTimeout(() => {
              logging.value = false
            }, 300)
          })
      })
    }

    return {
      model,
      needAuthCode,
      logging,
      buttonName,
      validateInfos,
      handleLoginClick,
      handleLogin
    }
  }
})
</script>
