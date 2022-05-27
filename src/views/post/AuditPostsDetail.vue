<template>
  <page-view>
    <a-spin :spinning="spinning">
      <div class="page-box">
        <a-skeleton v-if="JSON.stringify(postDetail) === '{}'" active />
        <div v-else>
          <a-descriptions :column="1" title="文章详情">
            <a-descriptions-item label="文章标题"> {{ postDetail.title }} </a-descriptions-item>
            <a-descriptions-item label="提交时间"> {{ postDetail.createTime | moment }} </a-descriptions-item>
            <a-descriptions-item label="提交用户"> {{ postDetail.createUserName }} </a-descriptions-item>
            <a-descriptions-item label="所属分类">
              <a-tag
                v-for="(category, categoryIndex) in postDetail.categories"
                :key="'category_' + categoryIndex"
                color="blue"
                style="margin-bottom: 8px"
              >
                {{ category.name }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="文章详情">
              <div
                style="border: 1px solid #e9e9e9; border-radius: 6px; padding: 16px"
                v-html="postDetail.content"
              ></div>
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <a-divider />
        <a-form-model
          ref="formModelRefs"
          :model="form"
          :label-col="{ span: 2 }"
          :wrapper-col="{ span: 6 }"
          :rules="rules"
        >
          <a-form-model-item label="审批结果" prop="status">
            <a-radio-group v-model="form.status">
              <a-radio value="APPROVED"> 审核通过 </a-radio>
              <a-radio value="AUDIT_NO_PASS"> 审核不通过 </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="审批意见" prop="auditReason">
            <a-input v-model="form.auditReason" type="textarea" :auto-size="{ minRows: 4, maxRows: 8 }" />
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 6, offset: 2 }">
            <a-button type="primary" @click="onSubmit"> 提交 </a-button>
            <a-button style="margin-left: 10px" @click="onCancel"> 取消 </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-spin>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'

import apiClient from '@/utils/api-client'

import axios from 'axios'
export default {
  name: 'AuditPostsDetail',
  components: {
    PageView
  },
  data() {
    return {
      spinning: false,
      form: {
        status: '',
        auditReason: ''
      },
      rules: {
        status: [{ required: true, message: '请选择审批结果', trigger: 'change' }]
      },
      postDetail: {}
    }
  },
  mounted() {
    this.getPost()
  },
  methods: {
    async getPost() {
      this.spinning = true
      const response = await apiClient.post.get(this.$route.query.id)
      this.spinning = false
      this.postDetail = response.data
    },

    onSubmit() {
      this.$refs.formModelRefs.validate(valid => {
        const body = JSON.parse(JSON.stringify(this.postDetail))
        body.status = this.form.status
        body.auditReason = this.form.auditReason
        const axiosConfig = {
          method: 'put',
          headers: {
            Authorization: window.localStorage.getItem('Access-Token'),
            'Content-Type': 'application/json'
          },
          data: body
        }
        if (valid) {
          this.spinning = true
          if (this.form.auditReason === 'APPROVED') {
            axios({
              url: `/api/admin/posts/${this.$route.query.id}/approved`,
              ...axiosConfig
            })
              // eslint-disable-next-line
              .then(resp => {
                this.$message.success('保存成功')
                this.$router.go(-1)
              })
              .catch(e => {
                this.$message.error(e.response.data.message)
              })
              .finally(() => {
                this.spinning = false
              })
          } else {
            axios({
              url: `/api/admin/posts/${this.$route.query.id}/auditnopass`,
              ...axiosConfig
            })
              // eslint-disable-next-line
              .then(resp => {
                this.$message.success('保存成功')
                this.$router.go(-1)
              })
              .catch(e => {
                this.$message.error(e.response.data.message)
              })
              .finally(() => {
                this.spinning = false
              })
          }
        }
      })
    },

    onCancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.page-box {
  background-color: white;
  padding: 16px;
}
</style>
