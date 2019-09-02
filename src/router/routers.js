import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/login/:loginType',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      },
      {
        path: '/user-center',
        name: 'user_center',
        meta: {
          hideInMenu: true,
          title: '个人中心',
          notCache: true,
          icon: 'md-home',
          access: 'admin/User/own'
        },
        component: () => import('@/view/single-page/own/own.vue')
      }
    ]
  },
  {
    path: '/system',
    name: 'system_setting',
    meta: {
      icon: 'ios-build',
      title: '系统配置',
      access: ['admin/Menu/index', 'admin/User/index', 'admin/Auth/index', 'admin/Log/index']
    },
    component: Main,
    children: [
      {
        path: 'menu',
        name: 'menu_setting',
        meta: {
          icon: 'md-menu',
          title: '菜单维护',
          access: 'admin/Menu/index'
        },
        component: () => import('@/view/system/menu.vue')
      },
      {
        path: 'user',
        name: 'user_setting',
        meta: {
          icon: 'ios-people',
          title: '用户管理',
          access: 'admin/User/index'
        },
        component: () => import('@/view/system/user.vue')
      },
      {
        path: 'auth',
        name: 'auth_setting',
        meta: {
          icon: 'md-lock',
          title: '权限管理',
          access: 'admin/Auth/index'
        },
        component: () => import('@/view/system/auth.vue')
      },
      {
        path: 'log',
        name: 'logs',
        meta: {
          icon: 'md-clipboard',
          title: '操作日志',
          access: 'admin/Log/index'
        },
        component: () => import('@/view/system/log.vue')
      }
    ]
  },
  {
    path: '/apps',
    name: 'apps_setting',
    meta: {
      icon: 'md-cloud',
      title: '应用接入',
      access: ['admin/AppGroup/index', 'admin/App/index']
    },
    component: Main,
    children: [
      {
        path: 'appsGroup',
        name: 'apps_group',
        meta: {
          icon: 'ios-archive',
          title: '应用分组',
          access: 'admin/AppGroup/index'
        },
        component: () => import('@/view/app/group.vue')
      },
      {
        path: 'appsList',
        name: 'apps_list',
        meta: {
          icon: 'md-list-box',
          title: '应用列表',
          access: 'admin/App/index'
        },
        component: () => import('@/view/app/list.vue')
      }
    ]
  },
  {
    path: '/interface',
    name: 'interface_setting',
    meta: {
      icon: 'ios-link',
      title: '接口管理',
      access: ['admin/InterfaceList/index', 'admin/InterfaceGroup/index']
    },
    component: Main,
    children: [
      {
        path: 'interfaceGroup',
        name: 'interface_group',
        meta: {
          icon: 'md-archive',
          title: '接口分组',
          access: 'admin/InterfaceGroup/index'
        },
        component: () => import('@/view/interface/group.vue')
      },
      {
        path: 'interfaceList',
        name: 'interface_list',
        meta: {
          icon: 'md-infinite',
          title: '接口列表',
          access: 'admin/InterfaceList/index'
        },
        component: () => import('@/view/interface/list.vue')
      },
      {
        path: 'request/:hash',
        meta: {
          title: '请求参数',
          hideInMenu: true
        },
        name: 'interface_request',
        component: () => import('@/view/interface/request.vue')
      },
      {
        path: 'response/:hash',
        hideInMenu: true,
        meta: {
          hideInMenu: true,
          title: '返回参数'
        },
        name: 'interface_response',
        component: () => import('@/view/interface/response.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  },
  {
    path: '/wiki/list',
    name: 'wiki_list',
    meta: {
      title: '文档列表',
      hideInMenu: true
    },
    component: () => import('@/view/wiki/list.vue')
  },
  {
    path: '/wiki/error',
    name: 'wiki_error',
    meta: {
      title: '错误码',
      hideInMenu: true
    },
    component: () => import('@/view/wiki/error-code.vue')
  },
  {
    path: '/wiki/calculation',
    name: 'wiki_calculation',
    meta: {
      title: '算法详解',
      hideInMenu: true
    },
    component: () => import('@/view/wiki/calculation.vue')
  },
  {
    path: '/wiki/login',
    name: 'wiki_login',
    meta: {
      title: '文档登录',
      hideInMenu: true
    },
    component: () => import('@/view/wiki/login.vue')
  }
]
