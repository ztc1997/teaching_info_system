import axios from 'axios'
import store from './store'
import router from './router'
import {CLEAR_USER} from '@/store/mutation-types'

axios.defaults.timeout = 5000
axios.defaults.baseURL = '/api'

// 为每个请求加入 CSRFToken
axios.interceptors.request.use(
  config => {
    if (store.state.CSRFToken !== '')
      config.headers['X-CSRF-TOKEN'] = store.state.CSRFToken
    return config
  }
)

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除用户信息并跳转到登录页面
          store.commit(CLEAR_USER)
          router.replace({
            path: '/login',
            query: {redirect: router.currentRoute.fullPath}
          })
      }
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  }
)

// 将 post 方法的数据由 json 转换为 form
/*axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    const params = new URLSearchParams()
    for (const key in config.data) {
      if (config.data.hasOwnProperty(key))
        params.append(key, config.data[key])
    }
    config.data = params
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  return config
})*/

export default axios
