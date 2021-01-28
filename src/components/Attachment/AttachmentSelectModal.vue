<template>
  <div>
    <a-modal
      :visible.sync="visible"
      title="插入附件"
      @cancel="$emit('update:visible',false)"
      width="50%"
    >
      <a-list
        :grid="{ gutter: 12, xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }"
        :dataSource="list.data"
        :loading="list.loading"
      >
        <a-list-item
          slot="renderItem"
          slot-scope="item, index"
          :key="index"
        >
          <a-card
            :bodyStyle="{ padding: 0 }"
            hoverable
          >
            <div class="attach-thumb">
              <img
                :src="item.thumbPath"
                loading="lazy"
              />
            </div>
            <a-card-meta class="p-3">
              <ellipsis
                :length="12"
                tooltip
                slot="description"
              >{{ item.name }}</ellipsis>
            </a-card-meta>
          </a-card>
        </a-list-item>
      </a-list>
    </a-modal>
  </div>
</template>
<script>
import attachmentApi from '@/api/attachment'
export default {
  name: 'AttachmentSelectModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: {
        data: [],
        loading: false,
      },
    }
  },
  watch: {
    visible(value) {
      value && this.handleListAttachments()
    },
  },
  methods: {
    handleListAttachments() {
      attachmentApi.query().then((response) => {
        this.list.data = response.data.data.content
      })
    },
  },
}
</script>
