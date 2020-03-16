import store from '@/store'

export default {
  inserted: (el, binding, vnode) => {
    store.dispatch('getUserInfo').then(user => {
      let myParent = el.parentNode
      if (user.access && !user.access.includes('admin/' + binding.value)) {
        myParent.removeChild(el)
      }
      if (myParent.childNodes) {
        if (myParent.childNodes.length === 0) {
          myParent.parentNode.removeChild(myParent)
        }
      }
    })
  }
}
