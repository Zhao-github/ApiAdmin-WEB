import axios from '@/libs/api.request'

/**
 * 获取接口组数据
 * @returns {wx.RequestTask | never}
 */
export const getHash = () => {
  return axios.request({
    url: 'InterfaceList/getHash',
    method: 'get'
  })
}

/**
 * 刷新路由
 * @returns {wx.RequestTask | never}
 */
export const refresh = () => {
  return axios.request({
    url: 'InterfaceList/refresh',
    method: 'get'
  })
}

/**
 * 获取接口数据
 * @returns {wx.RequestTask | never}
 */
export const getList = (params) => {
  return axios.request({
    url: 'InterfaceList/index',
    method: 'get',
    params: params
  })
}

export const del = (hash) => {
  return axios.request({
    url: 'InterfaceList/del',
    method: 'get',
    params: {
      hash: hash
    }
  })
}

/**
 * 启用/禁用接口
 * @param status
 * @param hash
 * @returns {wx.RequestTask | never}
 */
export const changeStatus = (status, hash) => {
  return axios.request({
    url: 'InterfaceList/changeStatus',
    method: 'get',
    params: {
      status: status,
      hash: hash
    }
  })
}

/**
 * 新增接口
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const add = (data) => {
  return axios.request({
    url: 'InterfaceList/add',
    method: 'post',
    data
  })
}

/**
 * 编辑接口
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const edit = (data) => {
  return axios.request({
    url: 'InterfaceList/edit',
    method: 'post',
    data
  })
}
