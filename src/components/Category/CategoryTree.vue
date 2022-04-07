<template>
  <a-tree
    v-if="!categories.loading"
    :checkedKeys="categoryIds"
    :treeData.sync="categories.data"
    checkStrictly
    checkable
    defaultExpandAll
    showLine
    @check="onCheck"
  >
  </a-tree>
</template>

<script>
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
  created() {
    this.handleListCategories()
  },
  methods: {
    async handleListCategories() {
      try {
        this.categories.loading = true

        const { data } = await apiClient.category.list({ sort: [], more: false })

        this.categories.data = this.convertDataToTree(data)
      } catch (error) {
        this.$log.error(error)
      } finally {
        this.categories.loading = false
      }
    },

    convertDataToTree(categories) {
      const hashMap = {}
      const treeData = []
      categories.forEach(
        category => (hashMap[category.id] = { ...category, key: category.id, title: category.name, children: [] })
      )
      categories.forEach(category => {
        const current = hashMap[category.id]
        if (category.parentId) {
          hashMap[category.parentId].children.push(current)
        } else {
          treeData.push(current)
        }
      })

      // set hasPassword field for tree node
      const setHasPasswordField = (categories, hasPassword = false) => {
        categories.forEach(category => {
          category.hasPassword = !!category.password || hasPassword
          if (category.hasPassword) {
            category.title = `${category.title}（加密）`
          }
          if (category.children && category.children.length) {
            setHasPasswordField(category.children, category.hasPassword)
          }
        })
      }
      setHasPasswordField(treeData)
      return treeData
    },

    onCheck(checkedKeys, e) {
      this.$log.debug('Chekced keys', checkedKeys)
      this.$log.debug('e', e)

      this.$emit('check', checkedKeys.checked)
    }
  }
}
</script>
