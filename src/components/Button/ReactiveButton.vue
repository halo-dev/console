<template>
  <a-button
    :type="type"
    @click="handleClick"
    :icon="computedIcon"
    :loading="loading"
  >{{ !loaded?text:loadedText }}</a-button>
</template>
<script>
export default {
  name: 'ReactiveButton',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    icon: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    loadedText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loaded: false
    }
  },
  watch: {
    loading(value) {
      if (!value) {
        this.loaded = true
        setTimeout(() => {
          this.loaded = false
          this.$emit('callback')
        }, 600)
      }
    }
  },
  computed: {
    computedIcon() {
      return !this.loaded ? this.icon : 'check-circle'
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>
