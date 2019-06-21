import request from '@/utils/request'

export function upload(data) {
  return request({
    headers: { 'Content-Type': 'multipart/form-data' },
    url: '/v1/upload/certs',
    method: 'post',
    data
  })
}
export function fetchAccessList(query) {
  return request({
    url: '/v1/admin-manage/admins',
    params: query,
    method: 'get'
  })
}

export function fetchAccessInfo({ adminId }) {
  return request({
    url: `/v1/admin-manage/admins/${adminId}`,
    method: 'get'
  })
}

export function createAccess(data) {
  return request({
    url: '/v1/admin-manage/admins',
    method: 'post',
    data
  })
}

export function updateAccess({ adminId }, data) {
  return request({
    url: `/v1/admin-manage/admins/${adminId}`,
    method: 'post',
    data
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

export function auditAccess({ recordId }, data) {
  return request({
    url: `/v1/admin-manage/records/${recordId}/verify-status`,
    method: 'post',
    data
  })
}
