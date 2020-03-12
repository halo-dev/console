<template>
  <div class="trix-middle-button">
    <button
      @click="show"
      type="button"
      class="trix-button trix-button--icon trix-button--icon-image"
      title="#{lang.indent}">#{lang.indent}
    </button>

    <a-modal
      :centered="true"
      title="选择图片"
      v-model="uploadVisible"
      :footer="null"
      :afterClose="onClose"
      destroyOnClose
      class="attachment"
    >
      <Attachment @onSelect="insertImage"></Attachment>
    </a-modal>
  </div>
</template>

<script>
import attachmentApi from '@/api/attachment'
import Attachment from './attachment/Attachment'

export default {
  name: 'ImageButton',
  components: {
    Attachment
  },
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      keepInBounds: true,
      imageCommand: '',
      uploadHandler: attachmentApi.upload,
      uploadVisible: false,
      imageByUrl: ''
    }
  },
  watch: {},
  methods: {
    insertImage: function(src) {
      this.$emit('onSelect', src)
      this.hide()
    },
    hide: function() {
      this.uploadVisible = false
    },
    show: function() {
      this.uploadVisible = true
    },
    onClose: function() {
      this.editor.focus()
    }
  }
}

</script>

<style>
</style>
