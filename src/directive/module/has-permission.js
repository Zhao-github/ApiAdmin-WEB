import store from '@/store'

export default {
  inserted: (el, binding, vnode) => {
    store.dispatch('getUserInfo').then(user => {
      if (user.access && !user.access.includes('admin/' + binding.value)) {
        el.parentNode.removeChild(el)
      }
    })
  }
}
