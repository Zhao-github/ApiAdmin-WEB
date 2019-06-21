import axios from '@/libs/api.request'

export const login = ({ username, password }) => {
  const data = {
    username,
    password
  }
  return axios.request({
    url: 'login/index',
    data,
    method: 'post'
  })
}

export const getUserInfo = () => {
  return axios.request({
    url: 'login/getUserInfo',
    method: 'get'
  })
}

export const logout = () => {
  return axios.request({
    url: 'login/logout',
    method: 'get'
  })
}

export const getUserIndex = (params) => {
  return axios.request({
    url: 'User/index',
    method: 'get',
    params: params
  })
}
