import axios from '@/libs/api.request'

/**
 * ��ȡӦ��������
 * @returns {wx.RequestTask | never}
 */
export const getHash = () => {
  return axios.request({
    url: 'InterfaceList/getHash',
    method: 'get'
  })
}
