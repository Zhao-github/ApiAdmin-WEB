import axios from '@/libs/api.request'

/**
 * 获取应用组数据
 * @returns {wx.RequestTask | never}
 */
export const getHash = () => {
  return axios.request({
    url: 'InterfaceList/getHash',
    method: 'get'
  })
}
