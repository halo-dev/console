<template>
  <a-card :body-style="{ padding: '24px' }" :bordered="false">
    <div class="analysis-card-container">
      <div class="meta">
        <span class="analysis-card-title">
          <slot name="title">{{ title }}</slot>
        </span>
        <span class="analysis-card-action">
          <slot name="action"></slot>
        </span>
      </div>
      <div class="number">
        <slot name="number">
          {{ number }}
        </slot>
      </div>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'AnalysisCard',
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    number: {
      type: Number,
      required: false,
      default: 0
    }
  }
}
</script>
