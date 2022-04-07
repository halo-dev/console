<template>
  <a-tree-select
    :allowClear="true"
    :treeData="categoryTreeData"
    :treeDataSimpleMode="true"
    v-model="categoryIdString"
    placeholder="请选择上级目录，默认为顶级目录"
    treeDefaultExpandAll
    @change="handleChange"
  >
  </a-tree-select>
</template>

<script>
export default {
  name: 'CategorySelectTree',
  props: {
    categoryId: {
      type: Number,
      required: true,
      default: 0
    },
    categories: {
      type: Array,
      required: false,
      default: () => []
    },
    root: {
      type: Object,
      required: false,
      default: () => {
        return {
          id: 0,
          title: '根目录',
          value: '0',
          pId: -1
        }
      }
    }
  },
  computed: {
    categoryTreeData() {
      return [this.root, ...this.convertDataToTree(this.categories)]
    },
    categoryIdString: {
      get() {
        return this.categoryId.toString()
      },
      set(value) {
        this.$emit('update:categoryId', value ? parseInt(value) : 0)
      }
    }
  },
  methods: {
    handleChange() {
      this.$emit('change')
    },

    convertDataToTree(categories) {
      const hashMap = {}
      const treeData = []
      categories.forEach(
        category =>
          (hashMap[category.id] = {
            ...category,
            title: category.name,
            value: category.id.toString(),
            pId: category.parentId,
            children: []
          })
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
          if (Object.hasOwn(category, 'postCount')) {
            category.title = `${category.title} - ${category.postCount} 篇`
          }
          if (category.children && category.children.length) {
            setHasPasswordField(category.children, category.hasPassword)
          }
        })
      }
      setHasPasswordField(treeData)
      return treeData
    }
  }
}
</script>
