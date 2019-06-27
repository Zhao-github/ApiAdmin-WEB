import axios from '@/libs/api.request'

/**
 * 获取应用组数据
 * @returns {wx.RequestTask | never}
 */
export const getList = () => {
  return axios.request({
    url: 'InterfaceList/getHash',
    method: 'get'
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
    url: 'AppGroup/changeStatus',
    method: 'get',
    params: {
      status: status,
      id: id
    }
  })
}

/**
 * 新增应用组
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const add = (data) => {
  return axios.request({
    url: 'AppGroup/add',
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
    url: 'AppGroup/edit',
    method: 'post',
    data
  })
}
