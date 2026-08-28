import request from '@/utils/request'

export function clientLogin(data) {
  return request({
    url: '/client/login',
    method: 'post',
    data,
    authType: 'client'
  })
}

export function clientRegister(data) {
  return request({
    url: '/client/register',
    method: 'post',
    data,
    authType: 'client'
  })
}

export function clientGetInfo() {
  return request({
    url: '/client/user/info',
    method: 'get',
    authType: 'client'
  })
}

export function clientUpdateInfo(data) {
  return request({
    url: '/client/user/update',
    method: 'post',
    data,
    authType: 'client'
  })
}

export function clientUpdatePassword(data) {
  return request({
    url: '/client/user/password',
    method: 'post',
    data,
    authType: 'client'
  })
}

export function clientLogout() {
  return request({
    url: '/client/logout',
    method: 'post',
    authType: 'client'
  })
}

export function clientPublishLostFound(data) {
  return request({ url: '/client/lost-found', method: 'post', data, authType: 'client' })
}

export function clientMyLostFound(data) {
  return request({ url: '/client/lost-found/mine', method: 'post', data: data || {}, authType: 'client' })
}
export function clientGetMyLostFound(id) { return request({ url: `/client/lost-found/${id}`, method: 'get', authType: 'client' }) }
export function clientUpdateLostFound(id, data) { return request({ url: `/client/lost-found/${id}`, method: 'put', data, authType: 'client' }) }
export function clientDeleteLostFound(id) { return request({ url: `/client/lost-found/${id}`, method: 'delete', authType: 'client' }) }
export function clientCompleteLostFound(id) { return request({ url: `/client/lost-found/${id}/complete`, method: 'post', authType: 'client' }) }

export function clientAiMatch(data) {
  return request({ url: '/client/ai-match/search', method: 'post', data, authType: 'client', timeout: 90000 })
}

export function clientApplyClaim(data) { return request({ url: '/client/claim/apply', method: 'post', data, authType: 'client' }) }
export function clientClaimStatus(infoId) { return request({ url: `/client/claim/status/${infoId}`, method: 'get', authType: 'client' }) }
export function clientGetClaimInfo(infoId) { return request({ url: `/client/claim/info/${infoId}`, method: 'get', authType: 'client' }) }
export function clientMyClaims(data) { return request({ url: '/client/claim/mine', method: 'post', data: data || {}, authType: 'client' }) }
export function clientReceivedClaims(data) { return request({ url: '/client/claim/received', method: 'post', data: data || {}, authType: 'client' }) }
export function clientCancelClaim(id) { return request({ url: `/client/claim/mine/${id}/cancel`, method: 'post', authType: 'client' }) }
export function clientReviewClaim(id, action, data) { return request({ url: `/client/claim/received/${id}/${action}`, method: 'post', data: data || {}, authType: 'client' }) }
export function clientMessages(infoId) { return request({ url: `/public/messages/by-info/${infoId}`, method: 'get' }) }
export function clientOwnerMessages(infoId) { return request({ url: `/client/message/by-info/${infoId}`, method: 'get', authType: 'client' }) }
export function clientPostMessage(data) { return request({ url: '/client/message', method: 'post', data, authType: 'client' }) }
export function clientMyMessages() { return request({ url: '/client/message/mine', method: 'get', authType: 'client' }) }
export function clientDeleteMessage(id) { return request({ url: `/client/message/${id}`, method: 'delete', authType: 'client' }) }
export function clientPostReport(data) { return request({ url: '/client/report', method: 'post', data, authType: 'client' }) }
export function clientMyReports() { return request({ url: '/client/report/mine', method: 'get', authType: 'client' }) }
