import request from '@/utils/request'

export function pageInfoMessage(current, size, data) {
  return request({
    url: `/info_message/page?current=${current}&size=${size}`,
    method: 'post',
    data: data || {}
  })
}

export function getInfoMessageById(id) {
  return request({
    url: '/info_message/' + id,
    method: 'get'
  })
}

export function deleteInfoMessage(id) {
  return request({
    url: '/info_message/' + id,
    method: 'delete'
  })
}

export function deleteBatchInfoMessage(ids) {
  return request({
    url: '/info_message/batch',
    method: 'delete',
    data: ids
  })
}
