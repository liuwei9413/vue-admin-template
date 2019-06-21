import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/v1/auth/login',
    method: 'post',
    data
  })
}

export function getCaptcha() {
  return request({
    url: `/v1/captcha/request?type=LOGIN&ts=${+new Date()}`,
    method: 'get'
  })
}

export function getInfo() {
  return request({
    url: '/v1/auth/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/v1/auth/logout',
    method: 'post'
  })
}

export function updatePassword(data) {
  return request({
    url: '/v1/user-center/update-password',
    method: 'post',
    data
  })
}

export function checkAccount(data) {
  return request({
    url: '/v1/find-password/send-email',
    method: 'post',
    data
  })
}

export function checkEmailCode(query, data) {
  return request({
    url: '/v1/find-password/check-mailcode',
    method: 'post',
    params: query,
    data
  })
}

export function newPassword(query, data) {
  return request({
    url: '/v1/find-password/new-password',
    method: 'post',
    params: query,
    data
  })
}

export function fetchUserList(query) {
  return request({
    url: '/v1/admin-manage/admins',
    params: query,
    method: 'get'
  })
}

export function fetchUserInfo({ adminId }) {
  return request({
    url: `/v1/admin-manage/admins/${adminId}`,
    method: 'get'
  })
}

export function createUser(data) {
  return request({
    url: '/v1/admin-manage/admins',
    method: 'post',
    data
  })
}

export function updateUser({ adminId }, data) {
  return request({
    url: `/v1/admin-manage/admins/${adminId}`,
    method: 'post',
    data
  })
}

export function disabledUser({ adminId }, data) {
  return request({
    url: `/v1/admin-manage/admins/${adminId}/disabled`,
    method: 'post',
    data
  })
}

export function deleteUser({ adminId }) {
  return request({
    url: `/v1/admin-manage/admins/${adminId}/delete`,
    method: 'post'
  })
}

export function fetchAuditList(query) {
  return request({
    url: '/v1/admin-manage/records',
    method: 'get',
    params: query
  })
}

export function fetchAuditHistory(query) {
  return request({
    url: '/v1/admin-manage/record-histories',
    method: 'get',
    params: query
  })
}

export function fetchRecordInfo({ recordId }) {
  return request({
    url: `/v1/admin-manage/records/${recordId}`,
    method: 'get'
  })
}

export function auditUser({ recordId }, data) {
  return request({
    url: `/v1/admin-manage/records/${recordId}/verify-status`,
    method: 'post',
    data
  })
}
