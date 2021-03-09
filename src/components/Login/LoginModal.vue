<template>
  <div>
    <a-modal
      v-model="loginModal"
      title="重新登录"
      :footer="null"
      :width="320"
      :maskClosable="false"
      @cancel="handleCancelLogin"
    >
      <LoginForm @success="onLoginSucceed" />
    </a-modal>
  </div>
</template>
<script>
import LoginForm from './LoginForm'

import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  components: {
    LoginForm
  },
  setup({ emit }) {
    const store = useStore()

    const loginModal = computed(() => store.getters.loginModal)

    const handleToggleLoginModal = () => store.dispatch('toggleLoginModal')

    const handleCancelLogin = () => {
      handleToggleLoginModal(false)
    }

    const onLoginSucceed = () => {
      emit('success')
    }

    return {
      loginModal,
      handleCancelLogin,
      onLoginSucceed
    }
  }
})
</script>
