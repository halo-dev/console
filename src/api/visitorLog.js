import service from '@/utils/service'

const baseUrl = '/api/admin/visits'

const visitLogApi = {}

visitLogApi.pageBy = logPagination => {
  return service({
    url: baseUrl,
    params: logPagination,
    method: 'get'
  })
}

visitLogApi.getVisitsByDay = days => {
  return service({
    url: `${baseUrl}/day`,
    params: {
      days: days
    },
    method: 'get'
  })
}

visitLogApi.getVisitsByMonth = months => {
  return service({
    url: `${baseUrl}/month`,
    params: {
      months: months
    },
    method: 'get'
  })
}

visitLogApi.getVisitsByRegion = () => {
  return service({
    url: `${baseUrl}/region`,
    method: 'get'
  })
}

export default visitLogApi
