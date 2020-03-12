<template>
  <span class="trix-middle-button">
    <button
      style="width: 2.5em"
      @click="onClick"
      type="button"
      class="trix-button trix-button--icon trix-button--icon-table"
    >table
    </button>
    <div
      class="menu-create-table"
      :class="{ 'show' : visible }"
    >
      <div class="table-size-info">{{ currentRow }} × {{ currentColumn }}
        <input
          type="checkbox"
          v-model="withHeaderRow"
          style="float: right">
      </div>
      <table>
        <tr
          v-for="r in maxSize"
          :key="r"
          :style="{ 'display' : displayRow(r)}"
        >
          <td
            v-for="c in maxSize"
            :key="c"
            :row="r"
            :col="c"
            :class="{ 'selected' : displayCol(r,c)}"
            @mouseenter="onMouseEnterSelectPanel(r,c)"
            @click="onSelect"
          ></td>
        </tr>
      </table>
    </div>
  </span>

</template>

<script>
export default {
  name: 'TableButton',
  props: {
    editor: {
      type: Object,
      default: null
    }
  },
  created: function() {
    var clientWidth = document.documentElement.clientWidth
    if (clientWidth < 640) {
      this.showAllRow = true
    }
  },
  data() {
    this.editor.on('focus', ({ view }) => {
      this.resetSelectPanel()
    })
    return {
      showAllRow: false,
      visible: false,
      maxSize: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      currentRow: 1,
      currentColumn: 1,
      withHeaderRow: false
    }
  },
  watch: {},
  methods: {
    displayRow: function(r) {
      if (this.showAllRow) return true
      return r <= this.currentRow + 1 ? 'block' : 'none'
    },
    displayCol: function(r, c) {
      return c <= this.currentColumn && r <= this.currentRow
    },
    onClick: function() {
      this.visible = !this.visible
    },
    onSelect: function(e) {
      this.$emit('onSelect', this.currentRow, this.currentColumn, this.withHeaderRow)
      this.resetSelectPanel()
    },
    onBlur: function() {
      setTimeout(() => {
        this.resetSelectPanel()
      }, 50)
    },
    resetSelectPanel: function() {
      this.currentColumn = 1
      this.currentRow = 1
      this.visible = false
    },
    onMouseEnterSelectPanel: function(row, col) {
      this.currentRow = row
      this.currentColumn = col
    }
  }
}

</script>
<style>

  /*表格*/
  .menu-create-table {
    background: #ffffff;
    padding: 10px 30px 30px 30px;
    box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
    margin-top: 1.6em;
    border-radius: 6px;
    position: absolute !important;
    display: none;
    z-index: 1;
  }

  .menu-create-table table {
    border: none;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
  }

  .toolbar-menu-table .menu-create-table table td {
    padding: 2px;
    cursor: pointer;
  }

  .menu-create-table table td:before {
    width: 12px;
    height: 12px;
    border: 1px solid #ddd;
    display: block;
    content: "";
  }

  .menu-create-table table td.selected:before {
    background-color: rgba(0, 152, 247, 0.3);
    border: solid 1px #0098f7;
  }

  .menu-create-table .table-size-info {
    text-indent: initial;
  }
</style>
