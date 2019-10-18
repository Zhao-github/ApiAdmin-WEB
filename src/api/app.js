import axios from '@/libs/api.request'

/**
 * 获取应用数据
 * @returns {wx.RequestTask | never}
 */
export const getList = (params) => {
  return axios.request({
    url: 'App/index',
    method: 'get',
    params: params
  })
}

/**
 * 刷新秘钥
 * @returns {wx.RequestTask | never}
 */
export const refreshAppSecretApi = () => {
  return axios.request({
    url: 'App/refreshAppSecret',
    method: 'get'
  })
}

/**
 * 获取应用权限信息
 * @returns {wx.RequestTask | never}
 */
export const getAppInfo = (id) => {
  return axios.request({
    url: 'App/getAppInfo',
    method: 'get',
    params: {
      id: id
    }
  })
}

export const del = (id) => {
  return axios.request({
    url: 'App/del',
    method: 'get',
    params: {
      id: id
    }
  })
}

/**
 * 显示/隐藏应用
 * @param status
 * @param id
 * @returns {wx.RequestTask | never}
 */
export const changeStatus = (status, id) => {
  return axios.request({
    url: 'App/changeStatus',
    method: 'get',
    params: {
      status: status,
      id: id
    }
  })
}

/**
 * 新增应用
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const add = (data) => {
  return axios.request({
    url: 'App/add',
    method: 'post',
    data
  })
}

/**
 * 编辑应用
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const edit = (data) => {
  return axios.request({
    url: 'App/edit',
    method: 'post',
    data
  })
}
