<template>
  <a-tag :color="tag.color" :style="{ color: labelColor }">
    {{ tag.name }}
  </a-tag>
</template>
<script>
import { labelColor } from '@/utils/colorUtil'
export default {
  name: 'PostTag',
  props: {
    tag: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    labelColor() {
      return labelColor(this.tag.color)
    }
  }
}
</script>
