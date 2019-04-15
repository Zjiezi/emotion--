import Main from '@/components/main'
import parentView from '@/components/parent-view'


/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [

    {
      path: '/',
      name: 'index',
      meta: {
        title: 'Index - 前端首页'
      },
      //要跳转的组件
      component: () => import('../view/front/index/index.vue')
    },

    {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录'
    },
    component: () => import('../view/front/login/login.vue')
  },

  {
    path: '/loginBack',
    name: 'loginBack',
    meta: {
      title: 'LoginBack - 后端登录'
    },
    component: () => import('../view/back/loginBack/backLogin.vue')
  },

  {
    path: '/moodIndex',
    name: 'moodIndex',
    meta: {
      title: '前端心情首页'
    },
    component: () => import('../view/front/business/moodIndex.vue')
  },

  {
    path: '/sale',
    name: 'sale',
    meta: {
      title: '心情贩卖'
    },
    component: () => import('../view/front/business/sale.vue')
  },

  {
    path: '/user',
    name: 'user',
    meta: {
      title: '心情贩卖'
    },
    component: () => import('../view/front/business/user.vue')
  },


  
  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/message/index.vue')
      }
    ]
  },


  // {
  //   path: '/multilevel',
  //   name: 'multilevel',
  //   meta: {
  //     icon: 'md-menu',
  //     title: '多级菜单'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'level_2_1',
  //       name: 'level_2_1',
  //       meta: {
  //         icon: 'md-funnel',
  //         title: '二级-1'
  //       },
  //       component: () => import('@/view/multilevel/level-2-1.vue')
  //     },
  //     {
  //       path: 'level_2_2',
  //       name: 'level_2_2',
  //       meta: {
  //         access: ['super_admin'],
  //         icon: 'md-funnel',
  //         showAlways: true,
  //         title: '二级-2'
  //       },
  //       component: parentView,
  //       children: [
  //         {
  //           path: 'level_2_2_1',
  //           name: 'level_2_2_1',
  //           meta: {
  //             icon: 'md-funnel',
  //             title: '三级'
  //           },
  //           component: () => import('@/view/multilevel/level-2-2/level-3-1.vue')
  //         }
  //       ]
  //     },
  //     {
  //       path: 'level_2_3',
  //       name: 'level_2_3',
  //       meta: {
  //         icon: 'md-funnel',
  //         title: '二级-3'
  //       },
  //       component: () => import('@/view/multilevel/level-2-3.vue')
  //     }
  //   ]
  // },

  // {
  //   path: '/401',
  //   name: 'error_401',
  //   meta: {
  //     hideInMenu: true
  //   },
  //   component: () => import('@/view/error-page/401.vue')
  // },
  // {
  //   path: '/500',
  //   name: 'error_500',
  //   meta: {
  //     hideInMenu: true
  //   },
  //   component: () => import('@/view/error-page/500.vue')
  // },

  //  {
  //   path: '/empty',
  //   name: 'empty',
  //   meta: {
  //     hideInMenu: true
  //   },
  //   component: () => import('@/view/error-page/empty.vue')
  // },
  {
    path: '/404',
    name: 'error404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }


]
