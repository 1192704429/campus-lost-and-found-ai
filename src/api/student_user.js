import request from '@/utils/request'
export function pageStudentUser(current, size, data) { return request({ url: `/student_user/page?current=${current}&size=${size}`, method: 'post', data: data || {} }) }
export function updateStudentUser(data) { return request({ url: '/student_user', method: 'put', data }) }
