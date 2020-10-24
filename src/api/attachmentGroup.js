import service from '@/utils/service'

const baseUrl = '/api/admin/attachments/groups'

const attachmentGroupApi = {}

attachmentGroupApi.listBy = params => {
  return service({
    url: baseUrl,
    params: params,
    method: 'get'
  })
}

attachmentGroupApi.create = params => {
  return service({
    url: baseUrl,
    data: params,
    method: 'post'
  })
}
export default attachmentGroupApi
