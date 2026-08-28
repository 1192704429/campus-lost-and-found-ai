import request from '@/utils/request'

export function pagePublicLostFound(current, size, params, sortBy) {
  return request({
    url: `/public/lost-found/page?current=${current}&size=${size}&sortBy=${sortBy || 'latest'}`,
    method: 'post',
    data: params || {}
  })
}

export function getPublicLostFound(id) {
  return request({ url: `/public/lost-found/${id}`, method: 'get', authType: 'client' })
}

export function getSimilarLostFound(id, limit) {
  return request({ url: `/public/lost-found/${id}/similar?limit=${limit || 6}`, method: 'get' })
}

export function listRecommendedLostFound(infoType, limit) {
  return request({
    url: `/public/lost-found/recommend?infoType=${infoType}&limit=${limit || 8}`,
    method: 'get',
    authType: 'client'
  })
}

export function pagePublicNotice(current, size, params) {
  return request({
    url: `/public/notice/page?current=${current}&size=${size}`,
    method: 'post',
    data: params || {}
  })
}

export function getPublicNotice(id) {
  return request({ url: `/public/notice/${id}`, method: 'get' })
}

export function listPublicBanner() {
  return request({ url: '/public/banner/list', method: 'post' })
}

export function listPublicCategories() {
  return request({ url: '/public/categories', method: 'get' })
}
