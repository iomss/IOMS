// import Vue from 'vue'
// import Router from 'vue-router'

// Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/home/index'),
        name: '首页',
        meta: { title: '首页', icon: 'fa fa-home', affix: true }
      }
    ]
  }
]

export const asyncRoutes = [
  /** when your routing map is too long, you can split it into small modules **/
  // 404 page must be placed at the end !!!
  {
    path: '/assets',
    name: '资产管理',
    meta: {
      title: '资产管理',
      icon: 'fa fa-home'
    },
    component: Layout,
    redirect: '/assets/list',
    children: [
      {
        path: 'list',
        name: '管理列表',
        meta: {
          title: '管理列表',
          icon: 'fa fa-home'
        },
        component: () => import('@/views/assets/list')
      }
    ]
  },
  {
    path: '/sparepPart',
    name: '备品备件',
    meta: {
      title: '备品备件',
      icon: 'fa fa-home'
    },
    component: Layout,
    redirect: '/sparepPart/list',
    children: [
      {
        path: 'list',
        name: '管理列表',
        component: () => import('@/views/sparepPart/list'),
        meta: {
          title: '管理列表',
          icon: 'fa fa-home'
        }
      }
    ]
  },
  {
    path: '/maintenance',
    name: '运维管理',
    meta: {
      title: '运维管理',
      icon: 'fa fa-home'
    },
    component: Layout,
    redirect: '/maintenance/list',
    children: [
      {
        path: 'list',
        name: '工单查询',
        component: () => import('@/views/maintenance/list'),
        meta: {
          title: '工单查询',
          icon: 'fa fa-home'
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

// const createRouter = () =>
//   new Router({
//     // mode: 'history', // require service support
//     scrollBehavior: () => ({ y: 0 }),
//     routes: constantRoutes
//   })

// const router = createRouter()

// // Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// export function resetRouter() {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher // reset router
// }

const routers = [...constantRoutes, ...asyncRoutes]
export default routers
