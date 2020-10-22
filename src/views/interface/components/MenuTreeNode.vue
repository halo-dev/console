<template>
  <a-list item-layout="horizontal">
    <draggable
      v-bind="dragOptions"
      tag="div"
      class="item-container"
      :list="list"
      :value="value"
      @input="emitter"
      @start="isDragging = true"
      @end="isDragging = false"
      handle=".title"
    >
      <transition-group>
        <div
          :key="item.id"
          v-for="(item) in realValue"
        >
          <a-list-item>
            <a-list-item-meta :description="item.url">
              <span
                slot="title"
                class="title cursor-move inline-block font-bold"
              >{{ item.name }}</span>
            </a-list-item-meta>
          </a-list-item>
          <div
            class="a-list-nested"
            style="margin-left: 44px;"
          >
            <MenuTreeNode :list="item.children" />
          </div>
        </div>
      </transition-group>
    </draggable>
  </a-list>
</template>
<script>
import draggable from 'vuedraggable'
import MenuForm from './MenuForm'
export default {
  name: 'MenuTreeNode',
  components: {
    draggable,
    MenuForm,
  },
  props: {
    value: {
      required: false,
      type: Array,
      default: null,
    },
    list: {
      required: false,
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      isDragging: false,
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 300,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      }
    },
    realValue() {
      return this.value ? this.value : this.list
    },
  },
  methods: {
    emitter(value) {
      this.$emit('input', value)
    },
  },
}
</script>
<style scoped>
.ghost {
  opacity: 0.8;
  background: #c8ebfb;
  padding: 0 10px;
}
</style>
