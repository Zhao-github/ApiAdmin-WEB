import config from '@/config'
import axios from 'axios'
import Vue from 'vue'

const vueObj = new Vue()
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

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
        vueObj.$Message.error(data.msg)
        throw new Error(data.msg);
      } else {
        return { data, status }
      }
    }, error => {
      return Promise.reject(error)
    })
  }

  request (options) {
    const instance = axios.create()
    options = Object.assign({
      baseURL: this.baseUrl,
      headers: {}
    }, options)
    this.interceptors(instance)
    return instance(options)
  }
}

const api_axios = new HttpRequest(baseUrl)
export default api_axios
