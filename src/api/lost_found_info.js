import request from '@/utils/request'

// 分页查询失物招领信息列表（current、size 放路径参数，其余放 body）
export function pageLostFoundInfo(current, size, params) {
  return request({
    url: `/lost_found_info/page?current=${current}&size=${size}`,
    method: 'post',
    data: params
  })
}

// 查询失物招领信息详情
export function getLostFoundInfoById(id) {
  return request({
    url: '/lost_found_info/' + id,
    method: 'get'
  })
}

// 新增失物招领信息
export function saveLostFoundInfo(data) {
  return request({
    url: '/lost_found_info',
    method: 'post',
    data: data
  })
}

// 修改失物招领信息
export function updateLostFoundInfo(data) {
  return request({
    url: '/lost_found_info',
    method: 'put',
    data: data
  })
}

// 删除失物招领信息
export function deleteLostFoundInfo(ids) {
  return request({
    url: '/lost_found_info/' + ids,
    method: 'delete'
  })
}

// 批量删除失物招领信息
export function deleteBatchLostFoundInfo(ids) {
  return request({
    url: '/lost_found_info/batch',
    method: 'delete',
    data: ids
  })
}


// 下拉选项：发布学生
export function listStudentUser(data) {
  return request({
    url: '/student_user/list',
    method: 'post',
    data: data || {}
  })
}

// 下拉选项：物品分类
export function listItemCategory(data) {
  return request({
    url: '/item_category/list',
    method: 'post',
    data: data || {}
  })
}

// 下拉选项：审核管理员
export function listAdminUser(data) {
  return request({
    url: '/admin_user/list',
    method: 'post',
    data: data || {}
  })
}

// 将指定类型的全部图片重新同步至 PicSight/Qdrant
export function rebuildLostFoundImageIndex(infoType) {
  return request({
    url: `/lost_found_info/image-index/rebuild?infoType=${infoType}`,
    method: 'post',
    timeout: 120000
  })
}
