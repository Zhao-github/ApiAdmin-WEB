import axios from '@/libs/api.request'

/**
 * 获取接口组数据
 * @returns {wx.RequestTask | never}
 */
export const getList = (params) => {
  return axios.request({
    url: 'AppGroup/index',
    method: 'get',
    params: params
  })
}

export const del = (id) => {
  return axios.request({
    url: 'AppGroup/del',
    method: 'get',
    params: {
      id: id
    }
  })
}
