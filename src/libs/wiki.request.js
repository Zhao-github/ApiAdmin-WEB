import config from '@/config'
import axios from 'axios'
import iView from 'view-design'
import { setToken, getToken } from '@/libs/util'
import router from '@/router'

export const baseUrl = (process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro) + 'wiki/'

class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
  }

  interceptors (instance) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      const { data, status } = res
      if (data.code !== 1) {
        if (data.code === -14) {
          setToken('')
          router.push({ name: 'wiki_login' })
        } else {
          iView.Message.error(data.msg)
        }
        throw new Error(data.msg)
      } else {
        return { data, status }
      }
    }, error => {
      return Promise.reject(error)
    })
  }

  request (options) {
    const instance = axios.create()
    let apiAuth = getToken()
    if (apiAuth === false) {
      options = Object.assign({
        baseURL: this.baseUrl,
        headers: {}
      }, options)
    } else {
      options = Object.assign({
        baseURL: this.baseUrl,
        headers: {
          apiAuth: apiAuth
        }
      }, options)
    }
    this.interceptors(instance)
    return instance(options)
  }
}

const api_axios = new HttpRequest(baseUrl)
export default api_axios
