import axios from '@/libs/api.request'

/**
 * 获取字段数据
 * @returns {wx.RequestTask | never}
 */
export const getDataType = (params) => {
  return axios.request({
    url: 'Fields/index',
    method: 'get',
    params: params
  })
}

export const upJson = (data) => {
  return axios.request({
    url: 'Fields/upload',
    method: 'post',
    data
  })
}

export const del = (id) => {
  return axios.request({
    url: 'Fields/del',
    method: 'get',
    params: {
      id: id
    }
  })
}

/**
 * 新增字段
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const add = (data) => {
  return axios.request({
    url: 'Fields/add',
    method: 'post',
    data
  })
}

/**
 * 编辑字段
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const edit = (data) => {
  return axios.request({
    url: 'Fields/edit',
    method: 'post',
    data
  })
}

export const getResponse = (params) => {
  return axios.request({
    url: 'Fields/response',
    method: 'get',
    params: params
  })
}

export const getRequest = (params) => {
  return axios.request({
    url: 'Fields/request',
    method: 'get',
    params: params
  })
}
