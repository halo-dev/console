<template>
  <div class="logo">
    <img
      :style="{ width: sidebarOpened ? '64px' : '48px' }"
      alt="Halo Logo"
      class="select-none cursor-pointer hover:brightness-125 transition-all"
      src="/images/logo.svg"
      @click="onLogoClick()"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import apiClient from '@/utils/api-client'
import throttle from 'lodash.throttle'
import { mixin } from '@/mixins/mixin'

export default {
  name: 'Logo',
  mixins: [mixin],
  data() {
    return {
      clickCount: 0
    }
  },
  computed: {
    ...mapGetters(['options'])
  },
  methods: {
    ...mapActions(['refreshOptionsCache']),
    onLogoClick: throttle(async function () {
      this.clickCount++
      if (this.clickCount === 10) {
        try {
          await apiClient.option.saveMapView({ developer_mode: true })

          await this.refreshOptionsCache()
          this.$message.success(`开发者选项已启用！`)
          this.clickCount = 0
          this.$router.push({ name: 'ToolList' }).catch(() => {})
        } catch (e) {
          this.$log.error(e)
        }
        return
      }
      if (this.clickCount >= 5) {
        if (this.options.developer_mode) {
          this.$message.info(`当前已启用开发者选项！`)
          this.clickCount = 0
        } else {
          this.$message.info(`再点击 ${10 - this.clickCount} 次即可启用开发者选项！`)
        }
      }
    }, 200)
  }
}
</script>
