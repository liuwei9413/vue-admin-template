import { login, logout, getInfo, updatePassword } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { setStorage, removeStorage } from '@/utils/storage'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  passwordStatus: 0,
  role: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_PASSWORD_STATUS: (state, passwordStatus) => {
    state.passwordStatus = passwordStatus
  },
  SET_ROLE: (state, role) => {
    state.role = role
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, verifyCode } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, verifyCode: verifyCode }).then(response => {
        const { data } = response

        commit('SET_TOKEN', data.loginId)
        setToken(data.loginId)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { role, username, passwordChangeStatus } = data

        commit('SET_ROLE', role)
        commit('SET_NAME', username)
        commit('SET_PASSWORD_STATUS', passwordChangeStatus)
        setStorage('passwordStatus', passwordChangeStatus)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // init password
  initPassword({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      updatePassword(params).then(() => {
        commit('SET_PASSWORD_STATUS', 1)
        setStorage('passwordStatus', 1)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLE', '')
        commit('SET_PASSWORD_STATUS', '')
        removeStorage('passwordStatus')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLE', '')
      commit('SET_PASSWORD_STATUS', '')
      removeStorage('passwordStatus')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

