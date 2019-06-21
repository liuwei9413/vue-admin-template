// import { getStorage, setStorage, removeStorage } from '@/utils/storage'

// const TokenKey = 'Admin-Token'

// export function getToken() {
//   return getStorage(TokenKey)
// }

// export function setToken(token) {
//   return setStorage(TokenKey, token)
// }

// export function removeToken() {
//   return removeStorage(TokenKey)
// }
import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
