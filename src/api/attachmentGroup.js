import service from '@/utils/service'

const baseUrl = '/api/admin/attachments/groups'

const attachmentGroupApi = {}

attachmentGroupApi.listBy = params => {
  return service({
    url: `${baseUrl}/${params}`,
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

attachmentGroupApi.deleteInBatch = params => {
  return service({
    url: baseUrl,
    data: params,
    method: 'delete'
  })
}

attachmentGroupApi.updateById = (id, params) => {
  return service({
    url: `${baseUrl}/${id}`,
    data: params,
    method: 'put'
  })
}
export default attachmentGroupApi
