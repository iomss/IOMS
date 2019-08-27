/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin']     所需权限   control the page roles (you can set roles)
    title: 'title'                the name show in sidebar and breadcrumb (recommend set)
    icon: 'icon-name'             the icon show in the sidebar
    noCache: true                 if set true, the page will no be cached(default is false)
    affix: true                   if set true, the tag will affix in the tags-view
    hidden: true                  if set true, item will not show in the sidebar(default is false)
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
  path: '/redirect',
  name: 'redirect',
  meta: {
    title: 'redirect',
    hidden: true,
    fullPath: '/redirect'
  },
  component: Layout,
  children: [{
    path: '/redirect/:path*',
    meta: {
      title: 'redirect',
      hidden: true,
      fullPath: '/redirect'
    },
    component: () => import('@/views/redirect/index')
  }]
},
{
  path: '/login',
  name: 'login',
  meta: {
    title: '登录',
    hidden: true,
    fullPath: '/login'
  },
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/404',
  name: '404',
  meta: {
    title: '404',
    hidden: true,
    fullPath: '/404'
  },
  component: () => import('@/views/error-page/404'),
  hidden: true
},
{
  path: '/401',
  name: '401',
  meta: {
    title: '401',
    hidden: true,
    fullPath: '/401'
  },
  component: () => import('@/views/error-page/401'),
  hidden: true
}
  // {
  //   path: '/',
  //   name: '/',
  //   meta: {
  //     title: '首页',
  //     icon: 'fa fa-home',
  //     fullPath: '/'
  //   },
  //   component: Layout,
  //   redirect: '/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/home/index'),
  //       name: 'index',
  //       meta: {
  //         title: '状态概览',
  //         icon: 'fa fa-home',
  //         fullPath: '/index',
  //         roles: ['EnterSystem'],
  //         affix: true
  //       }
  //     },
  //     {
  //       path: 'myjob',
  //       component: () => import('@/views/home/myjob'),
  //       name: 'myjob',
  //       meta: {
  //         title: '我的工作',
  //         icon: 'fa fa-home',
  //         fullPath: '/myjob',
  //         roles: ['EnterSystem'],
  //         affix: true
  //       }
  //     }
  //   ]
  // }
]

export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  {
    path: '/',
    name: '/',
    meta: {
      title: '首页',
      icon: 'fa fa-home',
      fullPath: '/',
      hidden: true
    },
    component: Layout,
    redirect: '/Workorder'
  },
  // 我都工作相关 权限已调整
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
    children: [{
      path: 'Watchmanlist',
      name: 'Workorder-Watchmanlist',
      component: () => import('@/views/Workorder/Watchmanlist'),
      meta: {
        title: '工作列表',
        icon: 'fa fa-home',
        roles: ['EnterSystem'],
        fullPath: '/Workorder/Watchmanlist'
      }
    },
    {
      path: 'MaintainerRob/:id',
      name: 'Workorder-MaintainerRob',
      component: () => import('@/views/Workorder/MaintainerRob'),
      meta: {
        title: '维修工程师抢单',
        icon: 'fa fa-home',
        roles: ['GrabOrder'],
        hidden: true,
        fullPath: '/Workorder/MaintainerRob'
      }
    },
    {
      path: 'MaintainerAddRecord/:id',
      name: 'Workorder-MaintainerAddRecord',
      component: () => import('@/views/Workorder/MaintainerAddRecord'),
      meta: {
        title: '维修工程师添加维修记录',
        icon: 'fa fa-home',
        roles: ['CreateRepairRecord'],
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
        roles: ['CreateRepairRecord'],
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
        roles: ['CreateRepairRecord'],
        hidden: true,
        fullPath: '/Workorder/MaintainerChangeOrder'
      }
    },
    {
      path: 'AcceptorOperate/:id',
      name: 'Workorder-AcceptorOperate',
      component: () => import('@/views/Workorder/AcceptorOperate'),
      meta: {
        title: '验收人员验收',
        icon: 'fa fa-home',
        roles: ['CheckRepairRecord'],
        hidden: true,
        fullPath: '/Workorder/AcceptorOperate'
      }
    },
    {
      path: 'AuditorOperate/:id',
      name: 'Workorder-AuditorOperate',
      component: () => import('@/views/Workorder/AuditorOperate'),
      meta: {
        title: '审核人员审核',
        icon: 'fa fa-home',
        roles: ['ReviewRepairRecord'],
        hidden: true,
        fullPath: '/Workorder/AuditorOperate'
      }
    }
    ]
  },
  // 资产相关 权限已调整
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
    children: [{
      path: 'list',
      name: 'assets-list',
      meta: {
        title: '资产列表',
        icon: 'fa fa-home',
        roles: ['ManageAsset'],
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
        roles: ['ManageAsset'],
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
        roles: ['ManageAsset'],
        fullPath: '/assets/Create'
      },
      component: () => import('@/views/assets/Create')
    }
    ]
  },

  // 清单相关
  {
    path: '/Inventory',
    name: 'Inventory',
    meta: {
      title: '清单管理',
      icon: 'fa fa-home',
      fullPath: '/Inventory'
    },
    component: Layout,
    redirect: '/Inventory/List',
    children: [{
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
        hidden: true,
        fullPath: '/Inventory/Info'
      },
      component: () => import('@/views/Inventory/Info')
    },
    {
      path: 'Update/:id',
      name: 'Inventory-Update',
      meta: {
        title: '生成清单详情',
        icon: 'fa fa-home',
        roles: ['show'],
        hidden: true,
        fullPath: '/Inventory/Update'
      },
      component: () => import('@/views/Inventory/Update')
    }
    ]
  },
  // 备品备件相关
  {
    path: '/SparePart',
    name: '/SparePart',
    meta: {
      title: '备品备件',
      icon: 'fa fa-home',
      fullPath: '/SparePart',
      roles: ['show']
    },
    component: Layout,
    redirect: '/SparePart/List',
    children: [{
      path: 'SparePartList',
      name: 'SparePartList-List',
      component: () => import('@/views/SparePart/sparePartList'),
      meta: {
        title: '备品备件管理',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/SparePart/sparePartList'
      }
    },
    {
      path: 'StoreroomList',
      name: 'StoreroomList-List',
      component: () => import('@/views/SparePart/StoreroomList'),
      meta: {
        title: '库房管理',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/SparePart/StoreroomList'
      }
    },
    {
      path: 'InstantInventory',
      name: 'InstantInventory-List',
      component: () => import('@/views/SparePart/InstantInventory'),
      meta: {
        title: '即时库存',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/SparePart/InstantInventory'
      }
    },
    {
      path: 'InstockList',
      name: 'InstockList-List',
      component: () => import('@/views/SparePart/InstockList'),
      meta: {
        title: '入库单查看',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/SparePart/InstockList'
      }
    },
    {
      path: 'OutstockList',
      name: 'OutstockList-List',
      component: () => import('@/views/SparePart/OutstockList'),
      meta: {
        title: '出库单查看',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/SparePart/OutstockList'
      }
    },
    {
      path: 'AllocationList',
      name: 'AllocationList-List',
      component: () => import('@/views/SparePart/AllocationList'),
      meta: {
        title: '调拨申请',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/SparePart/AllocationList'
      }
    },
    {
      path: 'AllocationCheck',
      name: 'AllocationCheck-List',
      component: () => import('@/views/SparePart/AllocationCheck'),
      meta: {
        title: '调拨申请单审批',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/SparePart/AllocationCheck'
      }
    }
    ]
  },

  // 运维管理相关 权限已调整
  {
    path: '/maintenance',
    name: 'maintenance',
    meta: {
      title: '运维管理',
      icon: 'fa fa-home',
      fullPath: '/maintenance'
    },
    component: Layout,
    redirect: '/maintenance/WatchmanAssetslist',
    children: [{
      path: 'WatchmanAssetslist',
      name: 'maintenance-WatchmanAssetslist',
      component: () => import('@/views/maintenance/WatchmanAssetslist'),
      meta: {
        title: '维修单录入',
        icon: 'fa fa-home',
        roles: ['CreateRepairOrder'],
        fullPath: '/maintenance/WatchmanAssetslist'
      }
    },
    {
      path: 'WatchmanDispatch/:id',
      name: 'maintenance-WatchmanDispatch',
      component: () => import('@/views/maintenance/WatchmanDispatch'),
      meta: {
        title: '值班人员派单',
        icon: 'fa fa-home',
        roles: ['Staff'],
        hidden: true,
        fullPath: '/maintenance/WatchmanDispatch'
      }
    }
    ]
  },
  // 维护管理相关
  {
    path: '/Repairmanage',
    name: '/Repairmanage',
    meta: {
      title: '维护管理',
      icon: 'fa fa-home',
      fullPath: '/Repairmanage',
      roles: ['show']
    },
    component: Layout,
    redirect: '/Repairmanage/List',
    children: [{
      path: 'RepairplanList',
      name: 'RepairplanList-List',
      component: () => import('@/views/Repairmanage/RepairplanList'),
      meta: {
        title: '维护计划',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/Repairmanage/RepairplanList'
      }
    },
    {
      path: 'RepairtaskList',
      name: 'RepairtaskList-List',
      component: () => import('@/views/Repairmanage/RepairtaskList'),
      meta: {
        title: '维护任务',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/Repairmanage/RepairtaskList'
      }
    },
    {
      path: 'RepaircheckList',
      name: 'RepaircheckList-List',
      component: () => import('@/views/Repairmanage/RepaircheckList'),
      meta: {
        title: '维护验收',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/Repairmanage/RepaircheckList'
      }
    }
    ]
  },
  // 预算管理相关
  {
    path: '/Budgetmanage',
    name: '/Budgetmanage',
    meta: {
      title: '预算管理',
      icon: 'fa fa-home',
      fullPath: '/Budgetmanage',
      roles: ['show']
    },
    component: Layout,
    redirect: '/Budgetmanage/List',
    children: [{
      path: 'HardwareMaintenance',
      name: 'HardwareMaintenance-List',
      component: () => import('@/views/Budgetmanage/HardwareMaintenance'),
      meta: {
        title: '硬件维护单价管理',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/Budgetmanage/HardwareMaintenance'
      }
    },
    {
      path: 'SoftwareMaintenance',
      name: 'SoftwareMaintenance-List',
      component: () => import('@/views/Budgetmanage/SoftwareMaintenance'),
      meta: {
        title: '软件维护单价管理',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/Budgetmanage/SoftwareMaintenance'
      }
    },
    {
      path: 'Informationsafety',
      name: 'Informationsafety-List',
      component: () => import('@/views/Budgetmanage/Informationsafety'),
      meta: {
        title: '信息安全单价管理',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/Budgetmanage/Informationsafety'
      }
    },
    {
      path: 'HardwareRepair',
      name: 'HardwareRepair-List',
      component: () => import('@/views/Budgetmanage/HardwareRepair'),
      meta: {
        title: '硬件维修单价管理',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/Budgetmanage/HardwareRepair'
      }
    },
    {
      path: 'SoftwareRepair',
      name: 'SoftwareRepair-List',
      component: () => import('@/views/Budgetmanage/SoftwareRepair'),
      meta: {
        title: '软件维修单价管理',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/Budgetmanage/SoftwareRepair'
      }
    },
    {
      path: 'ContractList',
      name: 'ContractList-List',
      component: () => import('@/views/Budgetmanage/ContractList'),
      meta: {
        title: '合同测算预算调整版',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/Budgetmanage/ContractList'
      }
    },
    {
      path: 'ContractEndList',
      name: 'ContractEndList-List',
      component: () => import('@/views/Budgetmanage/ContractEndList'),
      meta: {
        title: '合同测算预算合同版',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/Budgetmanage/ContractEndList'
      }
    },
    {
      path: 'EquipmentQuota',
      name: 'EquipmentQuota-List',
      component: () => import('@/views/Budgetmanage/EquipmentQuota'),
      meta: {
        title: '设备定额名称匹配',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/Budgetmanage/EquipmentQuota'
      }
    },
    {
      path: 'Rateinformation',
      name: 'Rateinformation-List',
      component: () => import('@/views/Budgetmanage/Rateinformation'),
      meta: {
        title: '费率信息管理',
        icon: 'fa fa-home',
        roles: ['show'],
        fullPath: '/Budgetmanage/Rateinformation'
      }
    }
    ]
  },
  // 用户相关 权限已调整
  {
    path: '/User',
    name: 'User',
    meta: {
      title: '用户管理',
      icon: 'fa fa-home',
      fullPath: '/User'
    },
    component: Layout,
    redirect: '/User/list',
    children: [{
      path: 'list',
      name: 'User-list',
      component: () => import('@/views/User/list'),
      meta: {
        title: '用户管理',
        icon: 'fa fa-home',
        roles: ['CreateUser'],
        fullPath: '/User/list'
      }
    }]
  },
  // 元数据相关 权限已调整
  {
    path: '/Meta',
    name: 'Meta',
    meta: {
      title: '设置',
      icon: 'fa fa-home',
      fullPath: '/Meta'
    },
    component: Layout,
    redirect: '/Meta/Type',
    children: [{
      path: 'brandModel',
      name: 'Meta-brandModel',
      meta: {
        title: '品牌型号',
        icon: 'fa fa-home',
        roles: ['ManageMeta'],
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
        roles: ['ManageMeta'],
        fullPath: '/Meta/Type'
      },
      component: () => import('@/views/Meta/Type')
    },
    {
      path: 'Source',
      name: 'Meta-Source',
      meta: {
        title: '设备来源',
        icon: 'fa fa-home',
        roles: ['ManageMeta'],
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
        roles: ['ManageMeta'],
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
        roles: ['ManageMeta'],
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
        roles: ['ManageMeta'],
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
        roles: ['ManageMeta'],
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
        roles: ['ManageMeta'],
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
        roles: ['ManageMeta'],
        fullPath: '/Meta/Fault'
      },
      component: () => import('@/views/Meta/Fault')
    },
    {
      path: 'RepairLevel',
      name: 'Meta-RepairLevel',
      meta: {
        title: '维修等级管理',
        icon: 'fa fa-home',
        roles: ['ManageMeta'],
        fullPath: '/Meta/RepairLevel'
      },
      component: () => import('@/views/Meta/RepairLevel')
    },
    {
      path: 'Unit',
      name: 'Meta-Unit',
      meta: {
        title: '部门管理',
        icon: 'fa fa-home',
        roles: ['ManageUnit'],
        fullPath: '/Meta/Unit'
      },
      component: () => import('@/views/Meta/Unit')
    },
    {
      path: 'Role',
      name: 'Meta-Role',
      meta: {
        title: '角色管理',
        icon: 'fa fa-home',
        roles: ['ManageRole'],
        fullPath: '/Meta/Role'
      },
      component: () => import('@/views/Meta/Role')
    },
    {
      path: 'Claims',
      name: 'Meta-Claims',
      meta: {
        title: '权限列表',
        icon: 'fa fa-home',
        roles: ['All'],
        hidden: true,
        fullPath: '/Meta/Claims'
      },
      component: () => import('@/views/Meta/Claims')
    }
    ]
  },
  // 404
  {
    path: '*',
    name: '*',
    meta: {
      title: '*',
      hidden: true,
      fullPath: '/404'
    },
    redirect: '/404',
    hidden: true
  }
]

const routers = [...constantRoutes, ...asyncRoutes]
export default routers
