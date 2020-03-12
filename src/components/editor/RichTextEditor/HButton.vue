<template>
  <div class="head-button">
    <a-select
      title="Ctrl+Shift+1"
      @blur="editor.focus()"
      v-model="level">
      <a-select-option @click="heading(0)" value="0">正文</a-select-option>
      <a-select-option @click="heading(1)" value="1">H1</a-select-option>
      <a-select-option @click="heading(2)" value="2">H2</a-select-option>
      <a-select-option @click="heading(3)" value="3">H3</a-select-option>
      <a-select-option @click="heading(4)" value="4">H4</a-select-option>
      <a-select-option @click="heading(5)" value="5">H5</a-select-option>
    </a-select>
  </div>
</template>

<script>
export default {
  name: 'HButton',
  components: {
  },
  props: {
    editor: {
      type: Object,
      required: true
    },
    currentLevel: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      level: '0'
    }
  },
  watch: {
    currentLevel: function(val) {
      this.level = val + ''
    }
  },
  methods: {
    heading: function(level) {
      this.$emit('onSelect', level)
    },
    getHeadingLevel(cmd) {
      for (let level = 2; level <= 5; level++) {
        if (cmd(level) === true) {
          return '' + level
        }
      }
      return '0'
    }
  }
}

</script>

<style>
  .head-button {
    border-bottom: 1px solid #ddd;
    font-weight: bold;
    line-height: 1.5;
  }
  .head-button  .ant-select-selection {
    border: 0 !important;
    height: initial;
    box-shadow: none !important;
  }
  .head-button .ant-select-selection__rendered {
    line-height: initial;
  }
</style>
