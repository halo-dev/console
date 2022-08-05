<template>
  <page-view>
    <template #extra>
      <a-space>
        <a-button type="primary" @click="form.visible = true">添加</a-button>
      </a-space>
    </template>
    <LinkCreateModal
      :form_.sync="form"
      :teams="computedTeams"
      @close="
        form.visible = false
        form.model = {}
      "
      @createOrUpdateLink="handleCreateOrUpdateLink"
      @saved="handleSavedCallback"
    />
    <a-row :gutter="12">
      <a-col :span="24" class="pb-3">
        <a-empty v-if="linkTeam.length === 0" />
        <draggable
          v-else
          :list="linkTeam"
          class="list-group"
          group="pull: 'false', put: false"
          handle=".mover"
          v-bind="dragOptions"
          @update="handleUpdateInBatch"
        >
          <transition-group type="transition">
            <a-card
              v-for="team in linkTeam"
              :key="team.team"
              :bodyStyle="{ padding: '16px' }"
              style="margin-bottom: 10px"
            >
              <template #title>
                {{ team.team ? team.team : '默认分组' }}
                <a-icon class="cursor-move mover ml-1 list-group-item" type="bars" />
              </template>
              <draggable
                :list="team.links"
                group="link"
                v-bind="dragOptions"
                @add="modal.lastAdd = team"
                @remove="handleRemove($event, team)"
                @update="handleUpdateInBatch"
              >
                <transition-group
                  class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  type="transition"
                >
                  <div
                    v-for="link in team.links"
                    :key="link.name"
                    class="cursor-move relative flex items-center space-x-3 rounded border border-solid border-gray-300 bg-white px-2 py-2 shadow-sm hover:border-gray-400 hover:shadow"
                  >
                    <div v-if="link.logo" class="flex-shrink-0">
                      <a-avatar :src="link.logo" class="h-12 w-12 rounded-full" size="large" />
                    </div>
                    <div class="flex flex-col gap-y-1.5 overflow-hidden">
                      <p class="mb-0 truncate text-sm font-medium text-gray-900 truncate">
                        {{ link.name }}
                      </p>
                      <p class="mb-0 truncate text-sm text-gray-500">{{ link.description }}</p>
                    </div>
                    <div class="absolute top-2 right-2 cursor-pointer hover:text-blue-600">
                      <a-dropdown>
                        <div style="width: 30px; display: flex; justify-content: flex-end">
                          <a-icon type="more" />
                        </div>
                        <template #overlay>
                          <a-menu>
                            <a-menu-item @click="handleEdit(link)"> 编辑</a-menu-item>
                            <a-menu-item @click="handleDeleteLink(link.id)"> 删除</a-menu-item>
                          </a-menu>
                        </template>
                      </a-dropdown>
                    </div>
                  </div>
                </transition-group>
              </draggable>
            </a-card>
          </transition-group>
        </draggable>
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
import { Modal } from 'ant-design-vue'
export default {
  mixins: [mixin, mixinDevice],
  components: {
    LinkCreateModal,
    PageView,
    draggable
  },
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
    removeConfirm() {
      Modal.confirm({
        title: '确定移出分组吗',
        content: '移出最后一个链接后，该分组将消失。确定要移出分组吗？',
        onCancel: () => {
          this.recoverTeam()
        },
        onOk: () => {
          this.removeTeam()
        }
      })
    },
    removeTeam() {
      this.linkTeam.splice(this.linkTeam.indexOf(this.modal.lastRemove), 1)
      this.modal.newIndex = null
    },
    recoverTeam() {
      const recover = this.modal.lastAdd.links.splice(this.modal.newIndex, 1)
      this.modal.lastRemove.links.push(recover[0])
      this.modal.newIndex = null
    },
    handleRemove(evt, team) {
      this.modal.lastRemove = team
      if (team.links.length === 0) {
        this.modal.newIndex = evt.newIndex
        this.removeConfirm()
      }
      this.handleUpdateInBatch()
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
        let toTeam, fromTeam, removeId
        for (const team of this.linkTeam) {
          if (toTeam && fromTeam) {
            break
          }
          if (team.team === this.form.model.team) {
            for (let link of team.links) {
              if (link.id === this.form.model.id) {
                // 分组没有改变， 直接update即可
                apiClient.link
                  .update(this.form.model.id, this.form.model)
                  .catch(() => {
                    this.form.errored = true
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.form.saving = false
                    }, 400)
                  })
                return
              }
            }
            toTeam = team
          } else {
            for (let i = 0; i < team.links.length; i++) {
              if (team.links[i].id === this.form.model.id) {
                fromTeam = team
                removeId = i
                break
              }
            }
          }
        }
        if (!toTeam) {
          toTeam = {
            links: [],
            priority: -1,
            team: this.form.model.team
          }
          this.linkTeam.push(toTeam)
        }

        toTeam.links.push(this.form.model)
        fromTeam.links.splice(removeId, 1)
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
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
</style>
