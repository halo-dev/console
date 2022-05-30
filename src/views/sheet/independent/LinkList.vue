<template>
  <page-view>
    <template slot="extra">
      <a-space>
        <a-button type="primary" @click="form.visible = true">添加</a-button>
      </a-space>
    </template>
    <a-modal :visible="modal.visible" title="确定移出分组吗" @ok="removeTeam" @cancel="recoverTeam">
      <p>移出最后一个链接后，该分组将消失。确定要移出分组吗？</p>
    </a-modal>
    <LinkCreateModal
      :form_.sync="form"
      :teams="computedTeams"
      @close="form.visible = false"
      @saved="handleSavedCallback"
      @createOrUpdateLink="handleCreateOrUpdateLink"
    />
    <a-row :gutter="12">
      <a-col :span="24" class="pb-3">
        <a-card :bodyStyle="{ padding: '16px' }" title="所有友情链接">
          <draggable
            class="list-group"
            :list="linkTeam"
            v-bind="dragOptions"
            handle=".mover"
            group="pull: 'false', put: false"
            @update="handleUpdateInBatch"
          >
            <transition-group type="transition">
              <a-card
                v-for="team in linkTeam"
                :key="team.team"
                :title="team.team ? team.team : '默认分组'"
                style="margin-bottom: 10px"
                class="shadow"
              >
                <template #extra><a-icon class="cursor-move mover mr-1 list-group-item" type="bars" /></template>
                <draggable
                  :list="team.links"
                  v-bind="dragOptions"
                  group="link"
                  @update="handleUpdateInBatch"
                  @remove="handleRemove($event, team)"
                  @add="modal.lastAdd = team"
                >
                  <transition-group
                    type="transition"
                    class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-8"
                  >
                    <div
                      v-for="link in team.links"
                      :key="link.name"
                      class="relative flex items-center space-x-3 rounded border border-gray-300 bg-white px-2 py-2 shadow-sm hover:border-gray-400 hover:shadow"
                    >
                      <div class="flex-shrink-0">
                        <a-avatar class="h-12 w-12 rounded-full" :src="link.logo" size="large" />
                      </div>
                      <div class="min-w-0 flex-1">
                        <div>
                          <p class="truncate text-sm font-medium text-gray-900" style="text-overflow: ellipsis">
                            {{ link.name }}
                          </p>
                          <p class="truncate text-sm text-gray-500 w-24">{{ link.description }}</p>
                        </div>
                      </div>
                      <div class="flex-col absolute top-0 right-0" style="justify-content: center">
                        <div>
                          <a-button @click="handleEdit(link)" class="!p-0" type="link">编辑</a-button>
                        </div>
                        <div>
                          <a-popconfirm
                            :title="'你确定要删除【' + link.name + '】链接？'"
                            cancelText="取消"
                            okText="确定"
                            @confirm="handleDeleteLink(link.id)"
                          >
                            <a-button class="!p-0" type="link danger">删除</a-button>
                          </a-popconfirm>
                        </div>
                      </div>
                    </div>
                  </transition-group>
                </draggable>
              </a-card>
            </transition-group>
          </draggable>
        </a-card>
      </a-col>
    </a-row>
    <div style="position: fixed; bottom: 30px; right: 30px">
      <a-button
        icon="setting"
        shape="circle"
        size="large"
        type="primary"
        @click="optionsModal.visible = true"
      ></a-button>
    </div>
    <a-modal v-model="optionsModal.visible" :afterClose="() => (optionsModal.visible = false)" title="页面设置">
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleSaveOptions()">保存</a-button>
      </template>
      <a-form layout="vertical">
        <a-form-item help="* 需要主题进行适配" label="页面标题：">
          <a-input v-model="optionsModal.data.links_title" />
        </a-form-item>
      </a-form>
    </a-modal>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import { mapActions } from 'vuex'
import draggable from 'vuedraggable'
import { mixin, mixinDevice } from '@/mixins/mixin.js'
import apiClient from '@/utils/api-client'
import LinkCreateModal from '@/views/sheet/components/LinkCreateModal'

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    ellipsis: true,
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '网址',
    dataIndex: 'url',
    ellipsis: true,
    scopedSlots: { customRender: 'url' }
  },
  {
    title: '分组',
    ellipsis: true,
    dataIndex: 'team'
  },
  {
    title: '排序',
    dataIndex: 'priority'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  mixins: [mixin, mixinDevice],
  components: {
    LinkCreateModal,
    PageView,
    draggable
  },
  display: 'Transitions',
  data() {
    return {
      modal: {
        toDelete: [],
        visible: false,
        newIndex: null,
        lastAdd: null,
        lastRemove: null
      },
      table: {
        columns,
        data: [],
        loading: false
      },
      form: {
        visible: false,
        model: {},
        saving: false,
        errored: false
      },
      optionsModal: {
        visible: false,
        data: []
      },
      teams: [],
      linkTeam: []
    }
  },
  computed: {
    title() {
      if (this.isUpdateMode) {
        return '修改友情链接'
      }
      return '添加友情链接'
    },
    isUpdateMode() {
      return !!this.form.model.id
    },
    computedTeams() {
      return this.teams.filter(item => {
        return item !== ''
      })
    },
    dragOptions() {
      return {
        animation: 200,
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  created() {
    this.handleListLinks()
    this.handleListLinkTeams()
    this.handleListOptions()
  },

  methods: {
    ...mapActions(['refreshOptionsCache']),
    getPriority() {
      const params = []
      for (const team of this.linkTeam) {
        for (const link of team.links) {
          link.team = team.team
          params.push(link)
        }
      }
      let priority = params.length
      for (const link of params) {
        link.priority = priority--
      }
      return params
    },
    handleUpdateInBatch() {
      const params = this.getPriority()
      apiClient.link.updateInBatch(params).finally(() => {
        this.table.loading = false
      })
    },
    removeTeam() {
      this.linkTeam.splice(this.linkTeam.indexOf(this.modal.lastRemove), 1)
      this.modal.newIndex = null
      this.modal.visible = false
    },
    recoverTeam() {
      const recover = this.modal.lastAdd.links.splice(this.modal.newIndex, 1)
      this.modal.lastRemove.links.push(recover[0])
      this.modal.newIndex = null
      this.modal.visible = false
    },
    handleRemove(evt, team) {
      this.modal.lastRemove = team
      if (team.links.length === 0) {
        this.modal.newIndex = evt.newIndex
        this.modal.visible = true
      }
      this.handleUpdateInBatch()
    },
    handleClose() {
      this.form.model = {}
      this.form.visible = false
      const timer = setTimeout(() => {
        this.$refs.linkForm.clearValidate()
      }, 1)
      this.$once('hook:beforeDestroy', () => {
        clearInterval(timer)
      })
    },
    splitIntoTeam(data) {
      const teamMap = new Map()
      for (const link of data) {
        if (teamMap.has(link.team)) {
          const team = teamMap.get(link.team)
          team.links.push(link)
          if (team.priority < link.priority) {
            team.priority = link.priority
          }
        } else {
          const team = {
            team: link.team,
            priority: link.priority,
            links: [link]
          }
          teamMap.set(link.team, team)
        }
      }
      this.linkTeam = Array.from(teamMap.values()).sort((a, b) => {
        return b.priority - a.priority
      })
    },
    handleListLinks() {
      this.table.loading = true
      apiClient.link
        .list()
        .then(response => {
          this.table.data = response.data
          this.table.data.sort((a, b) => {
            return b.priority - a.priority
          })
          this.splitIntoTeam(this.table.data)
        })
        .finally(() => {
          this.table.loading = false
        })
    },
    handleListLinkTeams() {
      apiClient.link.listTeams().then(response => {
        this.teams = response.data
      })
    },
    handleListOptions() {
      apiClient.option.list().then(response => {
        this.optionsModal.data = response.data
      })
    },
    handleEdit(record) {
      this.form.visible = true
      this.form.model = Object.assign({}, record)
    },
    handleDeleteLink(id) {
      apiClient.link
        .delete(id)
        .then(() => {
          this.$message.success('删除成功！')
        })
        .finally(() => {
          this.handleListLinks()
          this.handleListLinkTeams()
        })
    },
    handleCreateOrUpdateLink() {
      this.form.saving = true
      if (this.isUpdateMode) {
        let add, remove, removeId
        for (const team of this.linkTeam) {
          if (team.team === this.form.model.team) {
            for (let link of team.links) {
              if (link.id === this.form.model.id) {
                Object.assign(link, this.form.model)
              }
            }
            add = team
          } else {
            for (let i = 0; i < team.links.length; i++) {
              if (team.links[i].id === this.form.model.id) {
                remove = team
                removeId = i
                break
              }
            }
          }
        }
        if (add && remove && add.team !== remove.team) {
          add.links.push(this.form.model)
          remove.links.splice(removeId, 1)
        }
        const params = this.getPriority()
        apiClient.link
          .updateInBatch(params)
          .catch(() => {
            this.form.errored = true
          })
          .finally(() => {
            setTimeout(() => {
              this.form.saving = false
            }, 400)
          })
      } else {
        apiClient.link
          .create(this.form.model)
          .catch(() => {
            this.form.errored = true
          })
          .finally(() => {
            setTimeout(() => {
              this.form.saving = false
            }, 400)
          })
      }
    },
    handleSavedCallback() {
      if (this.form.errored) {
        this.form.errored = false
      } else {
        this.form.model = {}
        this.handleListLinks()
        this.handleListLinkTeams()
        this.form.visible = false
      }
      console.log(this.form)
    },
    handleSaveOptions() {
      apiClient.option
        .save(this.optionsModal.data)
        .then(() => {
          this.$message.success('保存成功！')
          this.optionsModal.visible = false
        })
        .finally(() => {
          this.handleListOptions()
          this.refreshOptionsCache()
        })
    }
  }
}
</script>
<style>
.link {
  height: 25px;
  min-width: 25px;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item-body {
  cursor: pointer;
  padding-right: 8px;
  padding-left: 3px;
  font-size: 16px;
}

.link {
  margin-top: 4px;
  margin-bottom: 4px;
}
</style>
