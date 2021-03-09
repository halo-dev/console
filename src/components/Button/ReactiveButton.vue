<template>
  <a-button :type="computedType" @click="handleClick" :loading="props.loading" :size="props.size" :block="props.block">
    {{ computedText }}
    <template #icon>
      <component v-if="computedIcon" :is="computedIcon"></component>
      <slot v-else-if="slots.icon" name="icon" />
    </template>
  </a-button>
</template>
<script>
import { defineComponent, ref, computed, watch, toRef } from 'vue'
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  components: {
    CloseCircleOutlined,
    CheckCircleOutlined
  },
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    icon: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: 'default'
    },
    block: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    errored: {
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
    },
    erroredText: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit, slots }) {
    const loaded = ref(false)
    const hasError = ref(false)

    const computedType = computed(() => {
      if (loaded.value) {
        return hasError.value ? 'danger' : props.type
      }
      return props.type
    })

    const computedIcon = computed(() => {
      if (loaded.value) {
        return hasError.value ? 'CloseCircleOutlined' : 'CheckCircleOutlined'
      }
      return null
    })

    const computedText = computed(() => {
      if (loaded.value) {
        return hasError.value ? props.erroredText : props.loadedText
      }
      return props.text
    })

    const handleClick = () => {
      emit('onClick')
    }

    const loading = toRef(props, 'loading')

    watch(loading, value => {
      if (!value) {
        loaded.value = true
        if (props.errored) {
          hasError.value = true
        }
        setTimeout(() => {
          loaded.value = false
          hasError.value = false
          emit('callback')
        }, 400)
      }
    })

    return {
      props,
      slots,
      computedType,
      computedIcon,
      computedText,
      handleClick
    }
  }
})
</script>
