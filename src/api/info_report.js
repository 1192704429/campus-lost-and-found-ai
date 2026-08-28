import request from '@/utils/request'

export function pageInfoReport(current, size, data) {
  return request({
    url: `/info_report/page?current=${current}&size=${size}`,
    method: 'post',
    data: data || {}
  })
}

export function getInfoReportById(id) {
  return request({
    url: '/info_report/' + id,
    method: 'get'
  })
}

export function handleInfoReport(data) {
  return request({
    url: '/info_report/handle',
    method: 'put',
    data
  })
}

export function deleteInfoReport(id) {
  return request({
    url: '/info_report/' + id,
    method: 'delete'
  })
}

export function deleteBatchInfoReport(ids) {
  return request({
    url: '/info_report/batch',
    method: 'delete',
    data: ids
  })
}
