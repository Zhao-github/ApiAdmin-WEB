import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, setTitle } from '@/libs/util'
import { oneOf } from '@/libs/tools'

Vue.use(Router)
const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  if (!token && to.name !== 'login') {
    // 未登录且要跳转的页面不是登录页
    next({
      name: 'login'
    })
  } else if (!token && to.name === 'login') {
    // 未登陆且要跳转的页面是登录页
    next()
  } else if (token && to.name === 'login') {
    // 已登录且要跳转的页面是登录页
    next({
      name: 'home'
    })
  } else {
    store.dispatch('getUserInfo').then(user => {
      // 路由中有相关配置才会识别并且鉴权，否则认为不需要鉴权
      if (to.meta && to.meta.access) {
        if (oneOf(to.meta.access, user.access)) {
          // 有权限，可访问
          next()
        } else {
          // 无权限，重定向到401页面
          next({ replace: true, name: 'error_401' })
        }
      } else {
        next()
      }
    }).catch(() => {
      setToken('')
      next({
        name: 'login'
      })
    })
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
