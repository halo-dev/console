<template>
  <div>a</div>
</template>

<script>
import { has } from 'lodash'

import { ACCESS_TOKEN } from '@/store/mutation-types'
import storage from 'store'
import { loginByAuthorizationCode } from '@/apis/auth'

export default {
  created() {
    if (!has(this.$route, 'query.code')) {
      this.$router.push({ path: '/user/login' })
    }
    loginByAuthorizationCode(this.$route.query.code)
      .then(result => {
        storage.set(ACCESS_TOKEN, result.access_token, 7 * 24 * 60 * 60 * 1000)
        this.$router.push({ path: storage.get('authorizationCodeRedirectUrl') || '/' })
      })
      .catch(() => {
        this.$router.push({ path: '/user/login' })
      })
  }
}
</script>

<style></style>
