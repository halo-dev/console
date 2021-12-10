<template>
  <a-tag :color="tag.color" :style="{ color: labelColor }">
    {{ tag.name }}
  </a-tag>
</template>
<script>
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
      // if (this.tag.color) {
      //   const color = Color(this.tag.color)
      //   return color.isLight() ? '#000' : '#fff'
      // }
      return '#fff'
    }
  }
}
</script>
