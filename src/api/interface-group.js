import axios from '@/libs/api.request'

/**
 * 获取应用组数据
 * @returns {wx.RequestTask | never}
 */
export const getList = (params) => {
  return axios.request({
    url: 'InterfaceGroup/index',
    method: 'get',
    params: params
  })
}

export const del = (hash) => {
  return axios.request({
    url: 'InterfaceGroup/del',
    method: 'get',
    params: {
      hash: hash
    }
  })
}

/**
 * 显示/隐藏应用组
 * @param status
 * @param id
 * @returns {wx.RequestTask | never}
 */
export const changeStatus = (status, id) => {
  return axios.request({
    url: 'InterfaceGroup/changeStatus',
    method: 'get',
    params: {
      status: status,
      id: id
    }
  })
}

/**
 * 获取列表【筛选项】
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const getAll = () => {
  return axios.request({
    url: 'InterfaceGroup/getAll',
    method: 'get'
  })
}

/**
 * 新增应用组
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const add = (data) => {
  return axios.request({
    url: 'InterfaceGroup/add',
    method: 'post',
    data
  })
}

/**
 * 编辑应用组
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const edit = (data) => {
  return axios.request({
    url: 'InterfaceGroup/edit',
    method: 'post',
    data
  })
}
