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
export default attachmentGroupApi
