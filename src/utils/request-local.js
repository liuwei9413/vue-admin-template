import axios from 'axios'
import { Message } from 'element-ui'

// axios.defaults.headers.post['Content-Type'] = 'application/json'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_LOCAL_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
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
    if (res.code !== 0) {
      // Message.error(`${error.message}`)
      Message.error(res.message)
      return Promise.reject(res)
    } else {
      // return res
      return Promise.resolve(res)
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message.error(`${'请插入key' || error.message}`)
    // Message.error(Vuei18n.t('error.netException'))
    return Promise.reject(error)
  }
)

export default service
