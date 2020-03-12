<template>
  <div>
    <button
      @click="show"
      :class="{ 'trix-active': isActive }"
      type="button"
      class="trix-button trix-button--icon trix-button--icon-link"
      title="#{lang.outdent}">#{lang.outdent}</button>

    <div
      class="trix-dialogs"
      :class="{ 'show' : visible }"
    >
      <div
        class="trix-dialog trix-dialog--link">
        <div class="trix-dialog__link-fields">
          <input
            @keydown.esc="hide"
            @keydown.enter.prevent="insertLink(true)"
            ref="urlInput"
            v-model="linkUrl"
            type="url"
            name="href"
            class="trix-input trix-input--dialog"
            placeholder="http://"
            aria-label="#{lang.url}"
            required
          >
          <div class="trix-button-group">
            <input
              @click="insertLink(true)"
              type="button"
              class="trix-button trix-button--dialog"
              value="链接"
              data-trix-method="setAttribute">
            <input
              @click="insertLink(false)"
              type="button"
              class="trix-button trix-button--dialog"
              value="解链"
              data-trix-method="removeAttribute">
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'LinkButton',
  components: {
  },
  props: {
    attributes: {
      type: Object,
      default: null
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      linkUrl: '',
      visible: false
    }
  },
  watch: {
    isActive: function(val) {
      if (val === true && this.visible === false) {
        this.show()
      } else if (val === false) {
        this.hide()
      }
    },
    attributes: function(val) {
      this.linkUrl = val.href
    }
  },
  methods: {
    insertLink: function(url) {
      this.$emit('onSelect', url ? this.linkUrl : null)
      this.visible = undefined
    },
    hide: function() {
      this.visible = false
    },
    show: function() {
      this.visible = true
      setTimeout(() => {
        this.$refs.urlInput.focus()
      }, 0)
    }
  }
}

</script>

<style>
  .trix-dialogs {
    position: absolute;
    margin-top: 1.6em;
    width: 100%;
    display: none;
  }
</style>
