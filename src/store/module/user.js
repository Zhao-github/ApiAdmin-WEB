import {
  login,
  logout,
  getUserInfo,
  getAccessMenu
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'
import { filterAsyncRouter } from '@/libs/router-utils'

export default {
  state: {
    userInfo: {},
    token: getToken()
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { username, password }) {
      username = username.trim()
      return new Promise((resolve, reject) => {
        login({ username, password }).then(res => {
          commit('setUserInfo', res.data.data)
          commit('setToken', res.data.data.apiAuth)
        }).then(() => {
          getAccessMenu().then(res => {
            if (res.data.code === 1) {
              let data = JSON.stringify(res.data.data) // 后台拿到路由
              sessionStorage.setItem('dynamicRouter', data) // 存储路由到localStorage
              data = filterAsyncRouter(JSON.parse(data))
              commit('updateMenuList', data)
            }
            resolve()
          })
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('setToken', '')
          commit('setUserInfo', {})
          sessionStorage.removeItem('dynamicRouter')
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      if (JSON.stringify(state.userInfo) !== '{}') {
        return state.userInfo
      } else {
        return new Promise((resolve, reject) => {
          try {
            getUserInfo().then(res => {
              commit('setUserInfo', res.data.data)
              resolve(res.data.data)
            }).catch(err => {
              reject(err)
            })
          } catch (error) {
            reject(error)
          }
        })
      }
    }
  }
}
