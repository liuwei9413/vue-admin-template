import request from '@/utils/request-local'

export function getSnlist() {
  return request({
    url: '/v3/snlist',
    method: 'get'
  })
}

export function getpublicinfo() {
  return request({
    url: '/v3/getpublicinfo',
    method: 'get'
  })
}

export function sign(query, data) {
  return request({
    url: '/v3/sign',
    method: 'post',
    params: query,
    data
  })
}
