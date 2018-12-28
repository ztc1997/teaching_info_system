import axios from 'axios'
import store from './store'

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
