import axios from '@/libs/api.request'

/**
 * ��ȡӦ������
 * @returns {wx.RequestTask | never}
 */
export const getList = (params) => {
  return axios.request({
    url: 'App/index',
    method: 'get',
    params: params
  })
}

/**
 * ˢ����Կ
 * @returns {wx.RequestTask | never}
 */
export const refreshAppSecretApi = (id) => {
  return axios.request({
    url: 'App/refreshAppSecret',
    method: 'get',
    id: id
  })
}

/**
 * ��ȡӦ��Ȩ����Ϣ
 * @returns {wx.RequestTask | never}
 */
export const getAppInfo = (id) => {
  return axios.request({
    url: 'App/getAppInfo',
    method: 'get',
    params: {
      id: id
    }
  })
}

export const del = (id) => {
  return axios.request({
    url: 'App/del',
    method: 'get',
    params: {
      id: id
    }
  })
}

/**
 * ��ʾ/����Ӧ��
 * @param status
 * @param id
 * @returns {wx.RequestTask | never}
 */
export const changeStatus = (status, id) => {
  return axios.request({
    url: 'App/changeStatus',
    method: 'get',
    params: {
      status: status,
      id: id
    }
  })
}

/**
 * ����Ӧ��
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const add = (data) => {
  return axios.request({
    url: 'App/add',
    method: 'post',
    data
  })
}

/**
 * �༭Ӧ��
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const edit = (data) => {
  return axios.request({
    url: 'App/edit',
    method: 'post',
    data
  })
}
