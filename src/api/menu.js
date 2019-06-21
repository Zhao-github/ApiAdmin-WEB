import axios from '@/libs/api.request'

/**
 * ��ȡ�˵��б�����
 * @returns {wx.RequestTask | never}
 */
export const getList = () => {
  return axios.request({
    url: 'Menu/index',
    method: 'get'
  })
}

/**
 * ��ʾ/���ز˵�
 * @param status
 * @param id
 * @returns {wx.RequestTask | never}
 */
export const changeStatus = (status, id) => {
  return axios.request({
    url: 'Menu/changeStatus',
    method: 'get',
    params: {
      status: status,
      id: id
    }
  })
}

/**
 * �����˵�
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const add = (data) => {
  return axios.request({
    url: 'Menu/add',
    method: 'post',
    data
  })
}

/**
 * �༭�˵�
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const edit = (data) => {
  return axios.request({
    url: 'Menu/edit',
    method: 'post',
    data
  })
}

/**
 * ɾ���˵�
 * @param status
 * @param id
 * @returns {wx.RequestTask | never}
 */
export const del = (id) => {
  return axios.request({
    url: 'Menu/del',
    method: 'get',
    params: {
      id: id
    }
  })
}
