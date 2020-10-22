<template>
  <page-view>
    <a-row :gutter="12">
      <a-col
        :xl="6"
        :lg="6"
        :md="6"
        :sm="24"
        :xs="24"
        class="mb-3"
      >
        <a-card
          :bodyStyle="{ padding: '16px' }"
          title="分组"
        >
          <template slot="extra">
            <a-button>
              设为默认
            </a-button>
          </template>
          <div class="menu-teams">
            <a-spin :spinning="teams.loading">
              <a-menu
                class="w-full"
                mode="inline"
                v-model="selectedTeam"
                v-if="teams.data.length>0"
                @select="handleSelectedTeam"
              >
                <a-menu-item
                  v-for="(team) in teams.data"
                  :key="team"
                >
                  {{ team===''?'未分组':team }}
                </a-menu-item>
              </a-menu>
            </a-spin>
          </div>
          <a-popover
            v-model="teams.form.visible"
            title="新增分组"
            trigger="click"
            placement="bottom"
            @visibleChange="handleTeamFormVisibleChange"
          >
            <template slot="content">
              <a-form-model
                ref="teamForm"
                :model="teams.form.model"
                :rules="teams.form.rules"
                @keyup.enter.native="handleCreateTeam"
              >
                <a-form-model-item prop="team">
                  <a-input
                    v-model="teams.form.model.team"
                    ref="teamInput"
                  />
                </a-form-model-item>
                <a-form-model-item style="margin-bottom:0">
                  <a-button
                    type="primary"
                    @click="handleCreateTeam"
                  >
                    新增
                  </a-button>
                </a-form-model-item>
              </a-form-model>
            </template>
            <a-button
              type="primary"
              block
              class="mt-3"
            >
              新增分组
            </a-button>
          </a-popover>
        </a-card>
      </a-col>
      <a-col
        :xl="18"
        :lg="18"
        :md="18"
        :sm="24"
        :xs="24"
        class="pb-3"
      >
        <a-card
          :title="menuListTitle"
          :bodyStyle="{ padding: '16px' }"
        >
          <template slot="extra">
            <a-space>
              <ReactiveButton
                @click="handleUpdateBatch"
                @callback="formBatch.errored=false"
                :loading="formBatch.saving"
                :errored="formBatch.errored"
                text="保存"
                loadedText="保存成功"
                erroredText="保存失败"
                :disabled="table.data.length<=0"
              ></ReactiveButton>
              <a-button
                type="primary"
                @click="handleOpenCreateMenuForm()"
              >
                新增
              </a-button>
            </a-space>
          </template>
          <a-spin :spinning="table.loading">
            <MenuForm
              v-if="form.visible"
              :menu="form.model"
              @succeed="handleCreateMenuSucceed()"
              @cancel="handleCloseCreateMenuForm()"
            />
            <a-empty v-if="table.data.length===0 && !table.loading && !form.visible" />
            <MenuTreeNode v-model="table.data" />
          </a-spin>
        </a-card>
      </a-col>
    </a-row>
  </page-view>
</template>

<script>
// components
import { PageView } from '@/layouts'
import draggable from 'vuedraggable'
import MenuTreeNode from './components/MenuTreeNode'
import MenuForm from './components/MenuForm'

import { deepClone } from '@/utils/util'

// apis
import menuApi from '@/api/menu'
export default {
  components: { PageView, draggable, MenuTreeNode, MenuForm },
  data() {
    return {
      table: {
        data: [],
        loading: false,
      },
      form: {
        visible: false,
        model: {},
      },
      formBatch: {
        saving: false,
        errored: false,
      },
      teams: {
        data: [],
        loading: false,
        selected: null,
        form: {
          visible: false,
          model: {
            team: null,
          },
          rules: {
            team: [{ required: true, message: '分组名称不能为空', trigger: ['change'] }],
          },
        },
      },
    }
  },
  computed: {
    computedTeams() {
      return this.teams.data.filter((item) => {
        return item !== ''
      })
    },
    computedMenusMoved() {
      const menus = deepClone(this.table.data)
      return this.handleMenuMoved(0, menus)
    },
    computedMenusWithoutLevel() {
      return this.handleGetMenusWithoutLevel(this.computedMenusMoved, [])
    },
    selectedTeam: {
      get() {
        return [this.teams.selected]
      },
      set(value) {
        this.teams.selected = value[0]
      },
    },
    menuListTitle() {
      return this.teams.selected === '' ? '未分组' : this.teams.selected
    },
  },
  created() {
    this.handleListTeams()
  },
  methods: {
    handleListTeams() {
      this.teams.loading = true
      menuApi
        .listTeams()
        .then((response) => {
          this.teams.data = response.data.data
          if (!this.teams.selected) {
            this.teams.selected = this.teams.data[0]
          }
          this.handleListMenus()
        })
        .finally(() => {
          setTimeout(() => {
            this.teams.loading = false
          }, 200)
        })
    },
    handleListMenus() {
      this.table.loading = true
      menuApi
        .listTreeByTeam(this.teams.selected)
        .then((response) => {
          this.table.data = response.data.data
        })
        .finally(() => {
          setTimeout(() => {
            this.table.loading = false
          }, 200)
        })
    },
    handleMenuMoved(pid, menus) {
      for (let i = 0; i < menus.length; i++) {
        menus[i].priority = i
        menus[i].parentId = pid
        menus[i].team = this.teams.selected
        if (menus[i].children && menus[i].children.length > 0) {
          this.handleMenuMoved(menus[i].id, menus[i].children)
        }
      }
      return menus
    },
    handleGetMenusWithoutLevel(menus, result) {
      for (var i = 0; i < menus.length; i++) {
        result.push(menus[i])
        var children = menus[i].children
        if (children.length > 0) {
          this.handleGetMenusWithoutLevel(children, result)
        }
      }
      return result
    },
    handleSelectedTeam({ item, key, selectedKeys }) {
      this.teams.selected = key
      this.handleCloseCreateMenuForm()
      this.handleListMenus()
    },
    handleDeleteMenu(id) {
      menuApi
        .delete(id)
        .then((response) => {
          this.$message.success('删除成功！')
        })
        .finally(() => {
          this.handleListTeams()
        })
    },
    handleUpdateBatch() {
      this.formBatch.saving = true
      menuApi
        .updateBatch(this.computedMenusWithoutLevel)
        .catch(() => {
          this.formBatch.errored = true
        })
        .finally(() => {
          setTimeout(() => {
            this.formBatch.saving = false
            this.handleListMenus()
          }, 400)
        })
    },
    handleTeamFormVisibleChange(visible) {
      if (visible) {
        this.teams.form.model.team = null
        this.$nextTick(() => {
          this.$refs.teamInput.focus()
        })
      }
    },
    handleCreateTeam() {
      const _this = this
      _this.$refs.teamForm.validate((valid) => {
        if (valid) {
          if (!_this.teams.data.includes(_this.teams.form.model.team)) {
            _this.teams.data.push(_this.teams.form.model.team)
          }
          _this.teams.selected = _this.teams.form.model.team
          _this.teams.form.visible = false
          _this.handleListMenus()
        }
      })
    },
    handleOpenCreateMenuForm() {
      this.form.visible = true
      this.form.model = {
        team: this.teams.selected,
        target: '_self',
      }
    },
    handleCloseCreateMenuForm() {
      this.form.visible = false
      this.form.model = {}
    },
    handleCreateMenuSucceed() {
      this.handleCloseCreateMenuForm()
      this.handleListMenus()
    },
  },
}
</script>
