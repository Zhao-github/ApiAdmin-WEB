import {
  login,
  logout,
  getUserInfo
} from '@/api/user'
import { resetRouter } from '@/router'
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
          sessionStorage.setItem('dynamicRouter', JSON.stringify(res.data.data.menu))
          commit('setUserInfo', res.data.data)
          commit('setToken', res.data.data.apiAuth)
          commit('updateMenuList', filterAsyncRouter(res.data.data.menu))
          resolve()
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
          resetRouter()
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
