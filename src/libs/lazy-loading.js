export default (url) => () => import(`@/view/${url}.vue`)
