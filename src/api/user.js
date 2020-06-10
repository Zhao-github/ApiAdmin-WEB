import axios from '@/libs/api.request'

/**
 *
 * @param username
 * @param password
 * @returns {never}
 */
export const login = ({ username, password }) => {
  const data = {
    username,
    password
  }
  return axios.request({
    url: 'Login/index',
    data,
    method: 'post'
  })
}

export const getUsers = (params) => {
  return axios.request({
    url: 'User/getUsers',
    method: 'get',
    params: params
  })
}

/**
 * 获取当前用户信息
 * @returns {never}
 */
export const getUserInfo = () => {
  return axios.request({
    url: 'Login/getUserInfo',
    method: 'get'
  })
}

/**
 * 用户登出
 * @returns {never}
 */
export const logout = () => {
  return axios.request({
    url: 'Login/logout',
    method: 'get'
  })
}

/**
 * 获取用户列表
 * @param params
 * @returns {never}
 */
export const getUserIndex = (params) => {
  return axios.request({
    url: 'User/index',
    method: 'get',
    params: params
  })
}

/**
 * 修改用户状态
 * @param status
 * @param id
 * @returns {never}
 */
export const changeStatus = (status, id) => {
  return axios.request({
    url: 'User/changeStatus',
    method: 'get',
    params: {
      status: status,
      id: id
    }
  })
}

/**
 * 新增用户
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const add = (data) => {
  return axios.request({
    url: 'User/add',
    method: 'post',
    data
  })
}

/**
 * 编辑用户
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const edit = (data) => {
  return axios.request({
    url: 'User/edit',
    method: 'post',
    data
  })
}

/**
 * 删除用户
 * @param status
 * @param id
 * @returns {wx.RequestTask | never}
 */
export const del = (id) => {
  return axios.request({
    url: 'User/del',
    method: 'get',
    params: {
      id: id
    }
  })
}

/**
 * 获取权限菜单
 * @returns {*}
 */
export const getAccessMenu = () => {
  return axios.request({
    url: 'Login/getAccessMenu',
    method: 'get'
  })
}

export const own = (data) => {
  return axios.request({
    url: 'User/own',
    method: 'post',
    data
  })
}
