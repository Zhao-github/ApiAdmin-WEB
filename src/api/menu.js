import axios from '@/libs/api.request'

export const getMenuList = () => {
  return axios.request({
    url: 'Menu/index',
    method: 'get'
  })
}
