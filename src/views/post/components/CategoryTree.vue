<template>
  <a-tree
    :checkedKeys="categoryIds"
    :treeData="categoryTree"
    checkStrictly
    checkable
    defaultExpandAll
    showLine
    @check="onCheck"
  >
  </a-tree>
</template>

<script>
import categoryApi from '@/api/category'
import apiClient from '@/utils/api-client'

export default {
  name: 'CategoryTree',
  model: {
    prop: 'categoryIds',
    event: 'check'
  },
  props: {
    categoryIds: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      categories: {
        data: [],
        loading: false
      }
    }
  },
  computed: {
    categoryTree() {
      if (!this.categories.data.length) {
        return []
      }
      return categoryApi.concreteTree(this.categories.data)
    }
  },
  created() {
    this.handleListCategories()
  },
  methods: {
    async handleListCategories() {
      try {
        this.categories.loading = true

        const { data } = await apiClient.category.list({ sort: [], more: false })

        this.categories.data = data.data
      } catch (error) {
        this.$log.error(error)
      } finally {
        this.categories.loading = false
      }
    },

    onCheck(checkedKeys, e) {
      this.$log.debug('Chekced keys', checkedKeys)
      this.$log.debug('e', e)

      this.$emit('check', checkedKeys.checked)
    }
  }
}
</script>
