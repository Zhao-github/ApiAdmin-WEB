import axios from '@/libs/api.request'

/**
 * 获取菜单列表数据
 * @returns {wx.RequestTask | never}
 */
export const getList = (params) => {
  return axios.request({
    url: 'Log/index',
    method: 'get',
    params: params
  })
}

export const del = (id) => {
  return axios.request({
    url: 'Log/del',
    method: 'get',
    params: {
      id: id
    }
  })
}
