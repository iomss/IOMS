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
    meta: {
      title: 'redirect',
      hidden: true
    },
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
    meta: {
      title: '登录',
      hidden: true
    },
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '404',
      hidden: true
    },
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    name: '401',
    meta: {
      title: '401',
      hidden: true
    },
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    name: '/',
    meta: {
      title: '首页',
      icon: 'fa fa-home',
      fullPath: '/'
    },
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/home/index'),
        name: 'index',
        meta: {
          title: '状态概览',
          icon: 'fa fa-home',
          fullPath: '/index',
          roles: [],
          affix: true
        }
      },
      {
        path: 'myjob',
        component: () => import('@/views/home/myjob'),
        name: 'myjob',
        meta: {
          title: '我的工作',
          icon: 'fa fa-home',
          fullPath: '/myjob',
          roles: [],
          affix: true
        }
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
        path: 'Info/:id',
        name: 'assets-Info',
        meta: {
          title: '资产明细',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/assets/Info/',
          hidden: true
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
    path: '/Meta',
    name: 'Meta',
    meta: {
      title: '资产设置',
      icon: 'fa fa-home',
      fullPath: '/Meta'
    },
    component: Layout,
    redirect: '/Meta/Type',
    children: [
      {
        path: 'brandModel',
        name: 'Meta-brandModel',
        meta: {
          title: '品牌型号',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Meta/brandModel'
        },
        component: () => import('@/views/Meta/brandModel')
      },
      {
        path: 'Type',
        name: 'Meta-Type',
        meta: {
          title: '设备类型',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Meta/Type'
        },
        component: () => import('@/views/Meta/Type')
      },
      {
        path: 'Position',
        name: 'Meta-Position',
        meta: {
          title: '设备位置',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Meta/Position'
        },
        component: () => import('@/views/Meta/Position')
      },
      {
        path: 'Source',
        name: 'Meta-Source',
        meta: {
          title: '设备来源',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Meta/Source'
        },
        component: () => import('@/views/Meta/Source')
      },
      {
        path: 'Equipment',
        name: 'Meta-Equipment',
        meta: {
          title: '设备管理',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Meta/Equipment'
        },
        component: () => import('@/views/Meta/Equipment')
      },
      {
        path: 'System',
        name: 'Meta-System',
        meta: {
          title: '设备系统',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Meta/System'
        },
        component: () => import('@/views/Meta/System')
      },
      {
        path: 'SI',
        name: 'Meta-SI',
        meta: {
          title: '设备集成商',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Meta/SI'
        },
        component: () => import('@/views/Meta/SI')
      },
      {
        path: 'positionType',
        name: 'Meta-positionType',
        meta: {
          title: '位置类型',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Meta/positionType'
        },
        component: () => import('@/views/Meta/positionType')
      },
      {
        path: 'position',
        name: 'Meta-position',
        meta: {
          title: '位置管理',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Meta/position'
        },
        component: () => import('@/views/Meta/Position')
      },
      {
        path: 'Fault',
        name: 'Meta-Fault',
        meta: {
          title: '故障管理',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Meta/Fault'
        },
        component: () => import('@/views/Meta/Fault')
      }
    ]
  },
  {
    path: '/Inventory',
    name: 'Inventory',
    meta: {
      title: '清单管理',
      icon: 'fa fa-home',
      fullPath: '/Inventory'
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
          fullPath: '/Inventory/Info',
          hidden: true
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
    redirect: '/Workorder/Watchmanlist',
    children: [
      {
        path: 'Watchmanlist',
        name: 'Workorder-Watchmanlist',
        component: () => import('@/views/Workorder/Watchmanlist'),
        meta: {
          title: '值班员工作列表',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Workorder/Watchmanlist'
        }
      },
      {
        path: 'Headmanlist',
        name: 'Workorder-Headmanlist',
        component: () => import('@/views/Workorder/Headmanlist'),
        meta: {
          title: '维修组长工作列表',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Workorder/Headmanlist'
        }
      },
      {
        path: 'Maintainerlist',
        name: 'Workorder-Maintainerlist',
        component: () => import('@/views/Workorder/Maintainerlist'),
        meta: {
          title: '维修工程师接单列表',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Workorder/Maintainerlist'
        }
      },
      {
        path: 'MaintainerAddRecord/:id',
        name: 'Workorder-MaintainerAddRecord',
        component: () => import('@/views/Workorder/MaintainerAddRecord'),
        meta: {
          title: '维修工程师添加维修记录',
          icon: 'fa fa-home',
          roles: ['show'],
          hidden: true,
          fullPath: '/Workorder/MaintainerAddRecord'
        }
      },
      {
        path: 'MaintainerReceipt/:id',
        name: 'Workorder-MaintainerReceipt',
        component: () => import('@/views/Workorder/MaintainerReceipt'),
        meta: {
          title: '维修工程师接单',
          icon: 'fa fa-home',
          roles: ['show'],
          hidden: true,
          fullPath: '/Workorder/MaintainerReceipt'
        }
      },
      {
        path: 'MaintainerChangeOrder/:id',
        name: 'Workorder-MaintainerChangeOrder',
        component: () => import('@/views/Workorder/MaintainerChangeOrder'),
        meta: {
          title: '维修工程师转单',
          icon: 'fa fa-home',
          roles: ['show'],
          hidden: true,
          fullPath: '/Workorder/MaintainerChangeOrder'
        }
      },
      {
        path: 'Acceptorlist',
        name: 'Workorder-Acceptorlist',
        component: () => import('@/views/Workorder/Acceptorlist'),
        meta: {
          title: '验收人员工作列表',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Workorder/Acceptorlist'
        }
      },
      {
        path: 'AcceptorOperate/:id',
        name: 'Workorder-AcceptorOperate',
        component: () => import('@/views/Workorder/AcceptorOperate'),
        meta: {
          title: '验收人员验收',
          icon: 'fa fa-home',
          roles: ['show'],
          hidden: true,
          fullPath: '/Workorder/AcceptorOperate'
        }
      },
      {
        path: 'Auditorlist',
        name: 'Workorder-Auditorlist',
        component: () => import('@/views/Workorder/Auditorlist'),
        meta: {
          title: '审核人员工作列表',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/Workorder/Auditorlist'
        }
      },
      {
        path: 'AuditorOperate/:id',
        name: 'Workorder-AuditorOperate',
        component: () => import('@/views/Workorder/AuditorOperate'),
        meta: {
          title: '审核人员审核',
          icon: 'fa fa-home',
          roles: ['show'],
          hidden: true,
          fullPath: '/Workorder/AuditorOperate'
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
    redirect: '/maintenance/WatchmanAssetslist',
    children: [
      {
        path: 'WatchmanAssetslist',
        name: 'maintenance-WatchmanAssetslist',
        component: () => import('@/views/maintenance/WatchmanAssetslist'),
        meta: {
          title: '工单资产列表',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/maintenance/WatchmanAssetslist'
        }
      },
      {
        path: 'WatchmanDispatch',
        name: 'maintenance-WatchmanDispatch',
        component: () => import('@/views/maintenance/WatchmanDispatch'),
        meta: {
          title: '值班人员派单',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/maintenance/WatchmanDispatch'
        }
      },
      {
        path: 'HeadmanDispatch',
        name: 'maintenance-HeadmanDispatch',
        component: () => import('@/views/maintenance/HeadmanDispatch'),
        meta: {
          title: '维修组长派单',
          icon: 'fa fa-home',
          roles: ['show'],
          fullPath: '/maintenance/HeadmanDispatch'
        }
      }
    ]
  },
  {
    path: '*',
    name: '*',
    meta: {
      title: '*',
      hidden: true
    },
    redirect: '/404',
    hidden: true
  }
]

const routers = [...constantRoutes, ...asyncRoutes]
export default routers
