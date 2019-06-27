import axios from '@/libs/api.request'

/**
 * ��ȡӦ��������
 * @returns {wx.RequestTask | never}
 */
export const getList = (params) => {
  return axios.request({
    url: 'InterfaceGroup/index',
    method: 'get',
    params: params
  })
}

export const del = (hash) => {
  return axios.request({
    url: 'InterfaceGroup/del',
    method: 'get',
    params: {
      hash: hash
    }
  })
}

/**
 * ��ʾ/����Ӧ����
 * @param status
 * @param id
 * @returns {wx.RequestTask | never}
 */
export const changeStatus = (status, id) => {
  return axios.request({
    url: 'InterfaceGroup/changeStatus',
    method: 'get',
    params: {
      status: status,
      id: id
    }
  })
}

/**
 * ����Ӧ����
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const add = (data) => {
  return axios.request({
    url: 'InterfaceGroup/add',
    method: 'post',
    data
  })
}

/**
 * �༭Ӧ����
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const edit = (data) => {
  return axios.request({
    url: 'InterfaceGroup/edit',
    method: 'post',
    data
  })
}
