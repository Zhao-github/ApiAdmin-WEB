import axios from '@/libs/api.request'

/**
 * 获取菜单列表数据
 * @returns {wx.RequestTask | never}
 */
export const getList = (keywords) => {
  keywords = keywords || ''
  return axios.request({
    url: 'Menu/index',
    method: 'get',
    params: {
      keywords: keywords
    }
  })
}

/**
 * 显示/隐藏菜单
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
 * 新增菜单
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
 * 编辑菜单
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
 * 删除菜单
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
