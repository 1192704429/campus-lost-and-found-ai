import request from '@/utils/request'

// 分页查询校园公告列表（current、size 放路径参数，其余放 body）
export function pageNoticeInfo(current, size, params) {
  return request({
    url: `/notice_info/page?current=${current}&size=${size}`,
    method: 'post',
    data: params
  })
}

// 查询校园公告详情
export function getNoticeInfoById(id) {
  return request({
    url: '/notice_info/' + id,
    method: 'get'
  })
}

// 新增校园公告
export function saveNoticeInfo(data) {
  return request({
    url: '/notice_info',
    method: 'post',
    data: data
  })
}

// 修改校园公告
export function updateNoticeInfo(data) {
  return request({
    url: '/notice_info',
    method: 'put',
    data: data
  })
}

// 删除校园公告
export function deleteNoticeInfo(ids) {
  return request({
    url: '/notice_info/' + ids,
    method: 'delete'
  })
}

// 批量删除校园公告
export function deleteBatchNoticeInfo(ids) {
  return request({
    url: '/notice_info/batch',
    method: 'delete',
    data: ids
  })
}


// 下拉选项：发布管理员
export function listAdminUser(data) {
  return request({
    url: '/admin_user/list',
    method: 'post',
    data: data || {}
  })
}
