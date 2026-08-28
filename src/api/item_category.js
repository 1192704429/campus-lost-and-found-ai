import request from '@/utils/request'
export function pageItemCategory(current, size, data) { return request({ url: `/item_category/page?current=${current}&size=${size}`, method: 'post', data: data || {} }) }
export function saveItemCategory(data) { return request({ url: '/item_category', method: 'post', data }) }
export function updateItemCategory(data) { return request({ url: '/item_category', method: 'put', data }) }
export function deleteItemCategory(id) { return request({ url: `/item_category/${id}`, method: 'delete' }) }
