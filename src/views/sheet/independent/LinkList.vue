<template>
  <page-view>
    <a-modal :visible="modal.visible" title="确定移出分组吗" @ok="removeTeam" @cancel="recoverTeam">
      <p>移出最后一个链接后，该分组将消失。确定要移出分组吗？</p>
    </a-modal>
    <a-modal :visible="form.visible" :footer="null" :closable="false" :maskClosable="false">
      <a-card :bodyStyle="{ padding: '16px' }" :title="title">
        <a-form-model ref="linkForm" :model="form.model" :rules="form.rules" layout="horizontal">
          <a-form-model-item label="网站名称：" prop="name">
            <a-input v-model="form.model.name"/>
          </a-form-model-item>
          <a-form-model-item help="* 需要加上 http://" label="网站地址：" prop="url">
            <a-input v-model="form.model.url"/>
          </a-form-model-item>
          <a-form-model-item label="Logo：" prop="logo">
            <a-input v-model="form.model.logo"/>
          </a-form-model-item>
          <a-form-model-item label="分组：" prop="team">
            <a-auto-complete v-model="form.model.team" :dataSource="computedTeams" allowClear/>
          </a-form-model-item>
          <a-form-model-item label="描述：" prop="description">
            <a-input v-model="form.model.description" :autoSize="{ minRows: 5 }" type="textarea"/>
          </a-form-model-item>
          <a-form-model-item>
            <div style="display: flex; justify-content: space-between">
              <ReactiveButton
                v-if="!isUpdateMode"
                :errored="form.errored"
                :loading="form.saving"
                erroredText="保存失败"
                loadedText="保存成功"
                text="保存"
                type="primary"
                @callback="handleSavedCallback"
                @click="handleCreateOrUpdateLink"
              ></ReactiveButton>
              <ReactiveButton
                v-else
                :errored="form.errored"
                :loading="form.saving"
                erroredText="更新失败"
                loadedText="更新成功"
                text="更新"
                type="primary"
                @callback="handleSavedCallback"
                @click="handleCreateOrUpdateLink"
              ></ReactiveButton>
              <ReactiveButton
                text="取消"
                type="danger"
                @click="handleClose"
              ></ReactiveButton>
            </div>
          </a-form-model-item>
        </a-form-model>
      </a-card>
    </a-modal>
    <a-row :gutter="12">
      <a-col :span="24" class="pb-3">
        <a-card :bodyStyle="{ padding: '16px' }" title="所有友情链接">
          <template #extra>
            <ReactiveButton text="添加" @click="form.visible=true"/>
          </template>
          <draggable
            class="list-group"
            :list="linkTeam"
            v-bind="dragOptions"
            handle=".mover"
            group="pull: 'false', put: false"
            @update="updatePriority"
          >
            <transition-group type="transition" :name="!drag ? 'flip-list' : null">
              <div
                v-for="(team, index) in linkTeam"
                :key="team.team"
              >
                    <span slot="title" class="inline-block font-bold title" style="font-size: 20px">
                      {{team.team?team.team:'默认分组'}}
                      <a-icon class="cursor-move mover mr-1 list-group-item" type="bars"/>
                    </span>
                    <draggable
                      :list="team.links"
                      v-bind="dragOptions"
                      group="link"
                      @update="updatePriority"
                      @remove="handleRemove($event, team)"
                      @add="modal.lastAdd=team"
                    >
                      <transition-group type="transition" :name="!drag ? 'flip-list' : null" style="display:flex; flex-wrap: wrap">
                            <a-popover 
                              trigger="click"
                              class="link"
                              v-for="link in team.links"
                              :key="link.name"
                            >
                              <template #content>
                                <a-button @click="handleEdit(link)" class="!p-0" type="link">编辑</a-button>
                                <a-divider type="vertical" />
                                <a-popconfirm
                                  :title="'你确定要删除【' + link.name + '】链接？'"
                                  cancelText="取消"
                                  okText="确定"
                                  @confirm="handleDeleteLink(link.id)"
                                  >
                                  <a-button class="!p-0" type="link">删除</a-button>
                                </a-popconfirm>
                              </template>
                              <a-tag class="link" style="height: 50px; width: 150px; display: flex; justify-content: space-around; align-items: center">
                                <a-card-meta :title="link.name" :description="link.description" style="width: 130px">
                                  <template #avatar>
                                    <a-avatar size="large" :src="link.logo" :style="link.description?{'margin-top': '4px'}:null"></a-avatar>
                                  </template>
                                </a-card-meta>
                              </a-tag>
                        </a-popover>
                      </transition-group>
                    </draggable>
                <a-divider v-if="index!==linkTeam.length-1"/>
              </div>
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
          <a-input v-model="optionsModal.data.links_title"/>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal >
      <a-form ref="emm">123123</a-form>
    </a-modal>
  </page-view>
</template>

<script>
import {PageView} from '@/layouts'
import {mapActions} from 'vuex'
import draggable from "vuedraggable";
import {mixin, mixinDevice} from '@/mixins/mixin.js'
import apiClient from '@/utils/api-client'

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    ellipsis: true,
    scopedSlots: {customRender: 'name'}
  },
  {
    title: '网址',
    dataIndex: 'url',
    ellipsis: true,
    scopedSlots: {customRender: 'url'}
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
    scopedSlots: {customRender: 'action'}
  }
]
export default {
  mixins: [mixin, mixinDevice],
  components: {
    PageView,
    draggable,
  },
  display: "Transitions",
  data() {
    return {
      modal: {
        toDelete: [],
        visible: false,
        newIndex: null,
        lastAdd: null,
        lastRemove: null,
      },
      drag: false,
      table: {
        columns,
        data: [],
        loading: false
      },
      form: {
        visible: false,
        model: {},
        saving: false,
        errored: false,
        rules: {
          name: [
            {required: true, message: '* 友情链接名称不能为空', trigger: ['change']},
            {max: 255, message: '* 友情链接名称的字符长度不能超过 255', trigger: ['change']}
          ],
          url: [
            {required: true, message: '* 友情链接地址不能为空', trigger: ['change']},
            {max: 1023, message: '* 友情链接地址的字符长度不能超过 1023', trigger: ['change']},
            {type: 'url', message: '* 友情链接地址格式有误', trigger: ['change']}
          ],
          logo: [{max: 1023, message: '* 友情链接 Logo 的字符长度不能超过 1023', trigger: ['change']}],
          description: [{max: 255, message: '* 友情链接描述的字符长度不能超过 255', trigger: ['change']}],
          team: [{max: 255, message: '* 友情链接分组的字符长度 255', trigger: ['change']}]
        }
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
        ghostClass: "ghost"
      };
    },

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
      let priority = params.length;
      for (const link of params) {
        link.priority = priority--
      }
      return params
    },
    updatePriority() {
      const params = this.getPriority()
      apiClient.link
        .updateInBatch(params)
        .finally(() => {
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
        this.modal.newIndex=evt.newIndex
        this.modal.visible = true
      }
      this.updatePriority()
    },
    handleClose() {
      this.form.model={}
      this.form.visible=false
      const timer = setTimeout(() =>{
        this.$refs.linkForm.clearValidate()
      }, 1);
      this.$once('hook:beforeDestroy', () => {
        clearInterval(timer);
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
      this.linkTeam = Array.from(teamMap.values()).sort((a, b) => {return b.priority - a.priority})
    },
    handleListLinks() {
      this.table.loading = true
      apiClient.link
        .list()
        .then(response => {
          this.table.data = response.data
          this.table.data.sort((a, b) => {return b.priority - a.priority})
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
      const _this = this
      _this.$refs.linkForm.validate(valid => {
        if (valid) {
          _this.form.saving = true
          if (_this.isUpdateMode) {
            for (const team of _this.linkTeam) {
              if (team.team === _this.form.model.team) {
                team.links.push(_this.form.model)
              } else {
                for (let i = 0; i < team.links.length; i++) {
                  if (team.links[i].id === _this.form.model.id) {
                    team.links.splice(i, 1)
                    break
                  }
                }
              }
            }
            const params = _this.getPriority()
            apiClient.link
              .updateInBatch(params)
              .catch(() => {
                this.form.errored = true
              })
              .finally(() => {
                setTimeout(() => {
                  _this.form.saving = false
                }, 400)
              })
          } else {
            apiClient.link
              .create(_this.form.model)
              .catch(() => {
                this.form.errored = true
              })
              .finally(() => {
                setTimeout(() => {
                  _this.form.saving = false
                }, 400)
              })
          }
        }
      })
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

.list-group-item-body{
  cursor: pointer;
  padding-right: 8px;
  padding-left: 3px;
  font-size:16px;
}

.link{
  margin-top: 4px;
  margin-bottom: 4px;
}
</style>
