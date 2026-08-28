import request from '@/utils/request'

export function listBanner(data) {
  return request({
    url: '/banner/list',
    method: 'post',
    data: data || {}
  })
}

export function pageBanner(current, size, data) {
  return request({ url: `/banner/page?current=${current}&size=${size}`, method: 'post', data: data || {} })
}

export function getBanner(id) {
  return request({ url: `/banner/${id}`, method: 'get' })
}

export function saveBanner(data) {
  return request({ url: '/banner', method: 'post', data })
}

export function updateBanner(data) {
  return request({ url: '/banner', method: 'put', data })
}

export function deleteBanner(id) {
  return request({ url: `/banner/${id}`, method: 'delete' })
}
