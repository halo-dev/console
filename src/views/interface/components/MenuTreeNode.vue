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
              >{{ item.name + (item.formVisible?'（正在编辑）':'') }}</span>
            </a-list-item-meta>
            <template slot="actions">
              <span @click="handleDelete(item.id)">
                删除
              </span>
            </template>
            <template slot="actions">
              <span @click="handleOpenEditForm(item)">
                编辑
              </span>
            </template>
            <template slot="actions">
              <span>
                更多
              </span>
            </template>
          </a-list-item>
          <MenuForm
            v-if="item.formVisible"
            :menu="item"
            @succeed="handleUpdateMenuSucceed(item)"
            @cancel="handleCloseCreateMenuForm(item)"
          />
          <div
            class="a-list-nested"
            style="margin-left: 44px;"
          >
            <MenuTreeNode
              :list="item.children"
              @reload="onReloadEmit"
            />
          </div>
        </div>
      </transition-group>
    </draggable>
  </a-list>
</template>
<script>
// components
import draggable from 'vuedraggable'
import MenuForm from './MenuForm'

// apis
import menuApi from '@/api/menu'
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
    handleDelete(id) {
      menuApi
        .delete(id)
        .then((response) => {
          this.$message.success('删除成功！')
        })
        .finally(() => {
          this.onReloadEmit()
        })
    },
    handleOpenEditForm(item) {
      this.$set(item, 'formVisible', true)
    },
    handleUpdateMenuSucceed(item) {
      this.handleCloseCreateMenuForm(item)
      // this.$emit('reload')
    },
    handleCloseCreateMenuForm(item) {
      this.$set(item, 'formVisible', false)
    },
    onReloadEmit() {
      this.$emit('reload')
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
