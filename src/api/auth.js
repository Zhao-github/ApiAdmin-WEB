import axios from '@/libs/api.request'

export const getGroups = () => {
  return axios.request({
    url: 'Auth/getGroups',
    method: 'get'
  })
}

/**
 * 获取权限列表数据
 * @returns {wx.RequestTask | never}
 */
export const getList = (params) => {
  return axios.request({
    url: 'Auth/index',
    method: 'get',
    params: params
  })
}

export const editRule = (data) => {
  return axios.request({
    url: 'Auth/editRule',
    method: 'post',
    data
  })
}

/**
 * 获取权限细节列表数据
 * @returns {wx.RequestTask | never}
 */
export const getRuleList = (params) => {
  return axios.request({
    url: 'Auth/getRuleList',
    method: 'get',
    params: params
  })
}

/**
 * 修改权限组状态
 * @param status
 * @param id
 * @returns {never}
 */
export const changeStatus = (status, id) => {
  return axios.request({
    url: 'Auth/changeStatus',
    method: 'get',
    params: {
      status: status,
      id: id
    }
  })
}

/**
 * 新增权限组
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const add = (data) => {
  return axios.request({
    url: 'Auth/add',
    method: 'post',
    data
  })
}

/**
 * 编辑权限组
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const edit = (data) => {
  return axios.request({
    url: 'Auth/edit',
    method: 'post',
    data
  })
}

/**
 * 删除权限组
 * @param status
 * @param id
 * @returns {wx.RequestTask | never}
 */
export const del = (id) => {
  return axios.request({
    url: 'Auth/del',
    method: 'get',
    params: {
      id: id
    }
  })
}

/**
 * 删除用户组成员
 * @param status
 * @param id
 * @returns {wx.RequestTask | never}
 */
export const delMember = (params) => {
  return axios.request({
    url: 'Auth/delMember',
    method: 'get',
    params: params
  })
}
