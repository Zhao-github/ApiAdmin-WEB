import axios from '@/libs/wiki.request'

/**
 *
 * @param username
 * @param password
 * @returns {never}
 */
export const errorCode = () => {
  return axios.request({
    url: 'Api/errorCode',
    method: 'get'
  })
}

export const apiGroup = () => {
  return axios.request({
    url: 'Api/groupList',
    method: 'get'
  })
}

/**
 * 新增用户
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const login = (data) => {
  return axios.request({
    url: 'Api/login',
    method: 'post',
    data
  })
}
