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
    roles: ['admin','editor']     所需权限   control the page roles (you can set multiple roles)
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
    name: 'redirect',
    meta: { title: 'redirect', hidden: true },
    component: Layout,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录', hidden: true },
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    meta: { title: '404', hidden: true },
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    name: '401',
    meta: { title: '401', hidden: true },
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    name: '/',
    meta: { title: '首页', icon: 'fa fa-home', fullPath: '/' },
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/home/index'),
        name: 'index',
        meta: { title: '状态概览', icon: 'fa fa-home', fullPath: '/index', affix: true }
      },
      {
        path: 'myjob',
        component: () => import('@/views/home/myjob'),
        name: 'myjob',
        meta: { title: '我的工作', icon: 'fa fa-home', fullPath: '/myjob', affix: true }
      }
    ]
  }
]

export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  {
    path: '/assets',
    name: 'assets',
    meta: {
      title: '资产管理',
      icon: 'fa fa-home',
      fullPath: '/assets'
    },
    component: Layout,
    redirect: '/assets/list',
    children: [
      {
        path: 'list',
        name: 'assets-list',
        meta: {
          title: '资产列表',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/assets/list'
        },
        component: () => import('@/views/assets/list')
      },
      {
        path: '/Info/:id',
        name: 'assets-Info',
        meta: {
          title: '资产详情',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/assets/Info'
        },
        component: () => import('@/views/assets/Info')
      },
      {
        path: 'Create',
        name: 'assets-Create',
        meta: {
          title: '新增资产',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/assets/Create'
        },
        component: () => import('@/views/assets/Create')
      }
    ]
  },
  {
    path: '/Assetsetting',
    name: 'Assetsetting',
    meta: {
      title: '资产设置',
      icon: 'fa fa-home',
      fullPath: '/Assetsetting'
    },
    component: Layout,
    redirect: '/Assetsetting/equipmentType',
    children: [
      {
        path: 'brandModel',
        name: 'Assetsetting-brandModel',
        meta: {
          title: '品牌型号',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Assetsetting/brandModel'
        },
        component: () => import('@/views/Assetsetting/brandModel')
      },
      {
        path: 'equipmentPosition',
        name: 'Assetsetting-equipmentPosition',
        meta: {
          title: '设备位置',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Assetsetting/equipmentPosition'
        },
        component: () => import('@/views/Assetsetting/equipmentPosition')
      },
      {
        path: 'equipmentSource',
        name: 'Assetsetting-equipmentSource',
        meta: {
          title: '设备来源',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Assetsetting/equipmentSource'
        },
        component: () => import('@/views/Assetsetting/equipmentSource')
      },
      {
        path: 'equipmentType',
        name: 'Assetsetting-equipmentType',
        meta: {
          title: '设备种类',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Assetsetting/equipmentType'
        },
        component: () => import('@/views/Assetsetting/equipmentType')
      },
      {
        path: 'systemOwner',
        name: 'Assetsetting-systemOwner',
        meta: {
          title: '所属系统',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Assetsetting/systemOwner'
        },
        component: () => import('@/views/Assetsetting/systemOwner')
      },
      {
        path: 'systemIntegrate',
        name: 'Assetsetting-systemIntegrate',
        meta: {
          title: '系统集成商',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Assetsetting/systemIntegrate'
        },
        component: () => import('@/views/Assetsetting/systemIntegrate')
      },
      {
        path: 'positionType',
        name: 'Assetsetting-positionType',
        meta: {
          title: '位置类型',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Assetsetting/positionType'
        },
        component: () => import('@/views/Assetsetting/positionType')
      }
    ]
  },
  {
    path: '/Inventory',
    name: 'Inventory',
    meta: {
      title: '清单管理',
      icon: 'fa fa-home'
    },
    component: Layout,
    redirect: '/Inventory/list',
    children: [
      {
        path: 'list',
        name: 'Inventory-list',
        meta: {
          title: '清单列表',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Inventory/List'
        },
        component: () => import('@/views/Inventory/List')
      },
      {
        path: 'Info/:id',
        name: 'Inventory-Info',
        meta: {
          title: '清单详情',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Inventory/Info'
        },
        component: () => import('@/views/Inventory/Info')
      },
      {
        path: 'selectList',
        name: 'Inventory-selectList',
        meta: {
          title: '生成清单详情',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Inventory/selectList'
        },
        component: () => import('@/views/Inventory/selectList')
      }
    ]
  },
  {
    path: '/sparepPart',
    name: 'sparepPart',
    meta: {
      title: '备品备件',
      icon: 'fa fa-home',
      fullPath: '/sparepPart'
    },
    component: Layout,
    redirect: '/sparepPart/list',
    children: [
      {
        path: 'list',
        name: 'sparepPart-list',
        component: () => import('@/views/sparepPart/list'),
        meta: {
          title: '备件列表',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/sparepPart/list'
        }
      }
    ]
  },
  {
    path: '/Workorder',
    name: 'Workorder',
    meta: {
      title: '我的工作',
      icon: 'fa fa-home',
      fullPath: '/Workorder'
    },
    component: Layout,
    redirect: '/Workorder/list',
    children: [
      {
        path: 'list',
        name: 'Workorder-list',
        component: () => import('@/views/Workorder/list'),
        meta: {
          title: '备件列表',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Workorder/list'
        }
      },
      {
        path: 'deallist',
        name: 'Workorder-deallist',
        component: () => import('@/views/Workorder/deallist'),
        meta: {
          title: '备件列表',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Workorder/deallist'
        }
      }
    ]
  },
  {
    path: '/maintenance',
    name: 'maintenance',
    meta: {
      title: '维护维修',
      icon: 'fa fa-home',
      fullPath: '/maintenance'
    },
    component: Layout,
    redirect: '/maintenance/list',
    children: [
      {
        path: 'list',
        name: 'maintenance-list',
        component: () => import('@/views/maintenance/list'),
        meta: {
          title: '工单列表',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/maintenance/list'
        }
      },
      {
        path: 'assetslist',
        name: 'maintenance-assetslist',
        component: () => import('@/views/maintenance/assetslist'),
        meta: {
          title: '工单资产列表',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/maintenance/assetslist'
        }
      },
      {
        path: 'createerror',
        name: 'maintenance-createerror',
        component: () => import('@/views/maintenance/createerror'),
        meta: {
          title: '资产列表报修',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/maintenance/createerror'
        }
      }
    ]
  },
  { path: '*', name: '*', meta: { title: '*', hidden: true }, redirect: '/404', hidden: true }
]

const routers = [...constantRoutes, ...asyncRoutes]
export default routers
