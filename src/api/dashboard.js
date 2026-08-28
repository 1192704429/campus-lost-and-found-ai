import request from '@/utils/request'

export function getDashboardOverview() {
  return request({
    url: '/dashboard/overview',
    method: 'get'
  })
}

export function getPublishTrend(days = 30) {
  return request({
    url: '/dashboard/publish-trend',
    method: 'get',
    params: { days }
  })
}

export function getCategoryStats() {
  return request({
    url: '/dashboard/category-stats',
    method: 'get'
  })
}

export function getRecoveryStats() {
  return request({
    url: '/dashboard/recovery-stats',
    method: 'get'
  })
}
