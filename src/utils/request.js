import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Vuei18n from '@/lang'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['x-auth-token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['x-auth-token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 1) {
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      // debugger
      if (res.code === 1001) {
        Message.error(Vuei18n.t('error.parameterNull'))
      } else if (res.code === 1002) {
        Message.error(Vuei18n.t('error.parameterIllegal'))
      } else if (res.code === 5001) {
        Message.error(Vuei18n.t('error.userLogout'))
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      } else if (res.code === 5002) {
        Message.error(Vuei18n.t('error.userUndefined'))
      } else if (res.code === 5003) {
        Message.error(Vuei18n.t('error.userDisabled'))
      } else if (res.code === 5004) {
        Message.error(Vuei18n.t('error.usernameOrPasswordError'))
      } else if (res.code === 5005) {
        Message.error(Vuei18n.t('error.originPasswordError'))
      } else if (res.code === 6000) {
        Message.error(Vuei18n.t('error.verifyCodeNull'))
      } else if (res.code === 6001) {
        Message.error(Vuei18n.t('error.verifyCodeError'))
      } else if (res.code === -1) {
        Message.error(Vuei18n.t('error.systemException'))
      }
      return Promise.reject(res)
    } else {
      // return res
      return Promise.resolve(res)
    }
  },
  error => {
    console.log('err' + error) // for debug
    // Message.error(`${error.message}`)
    Message.error(Vuei18n.t('error.netException'))
    return Promise.reject(error)
  }
)

export default service
