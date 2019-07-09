import axios from '@/libs/api.request'

/**
 * 使用QQ数据登录
 * @param params
 * @returns {wx.RequestTask | never | *}
 */
export const loginByQQ = (params) => {
  return axios.request({
    url: 'ThirdLogin/loginByQQ',
    method: 'get',
    params: params
  })
}

export const wx = (params) => {
  return axios.request({
    url: 'ThirdLogin/wx',
    method: 'get',
    params: params
  })
}

export const getQQCode = () => {
  return axios.request({
    url: 'ThirdLogin/getQQCode',
    method: 'get'
  })
}

export const getQr = () => {
  return axios.request({
    url: 'ThirdLogin/getQr',
    method: 'get'
  })
}

export const checkWxLogin = (params) => {
  return axios.request({
    url: 'ThirdLogin/checkWxLogin',
    method: 'get',
    params: params
  })
}

export const getWxCode = () => {
  return axios.request({
    url: 'ThirdLogin/getWxCode',
    method: 'get'
  })
}
