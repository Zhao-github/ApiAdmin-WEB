import axios from '@/libs/api.request'

/**
 * 获取菜单列表数据
 * @returns {wx.RequestTask | never}
 */
export const getGroups = () => {
  return axios.request({
    url: 'Auth/getGroups',
    method: 'get'
  })
}
