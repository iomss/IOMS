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

import emergencyRepairRoutes from './modules/emergencyRepair'
import devopsAssessRoutes from './modules/devopsAssess'
import integrityRateRoutes from './modules/integrityRate'
import repairStatisticsRoutes from './modules/repairStatistics'
import maintenanceSuperviseRoutes from './modules/maintenanceSupervise'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    meta: {
      title: 'redirect',
      hidden: true,
      fullPath: '/redirect'
    },
    children: [
      {
        path: '/redirect/:path*',
        meta: {
          title: 'redirect',
          hidden: true,
          fullPath: '/redirect/:path*'
        },
        component: () => import('@/views/redirect/index')
      }
    ]
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
      icon: 'fa fa-desktop',
      fullPath: '/',
      hidden: true
    },
    component: Layout,
    redirect: '/Workorder'
  },
  {
    path: '/fileDown',
    name: 'fileDown',
    meta: {
      title: '文件下载管理',
      hidden: true,
      fullPath: '/fileDown'
    },
    component: Layout,
    redirect: '/fileDown/fileDownIndex',
    children: [
      {
        path: 'fileDownIndex',
        name: 'FileDownindex',
        component: () => import('@/views/fileDown/index'),
        meta: {
          title: '文件下载管理',
          hidden: true,
          roles: ['EnterSystem'],
          fullPath: '/fileDown/fileDownIndex'
        }
      }
    ]
  },
  // 我都工作相关 权限已调整
  {
    path: '/Workorder',
    name: 'Workorder',
    meta: {
      title: '我的工作',
      icon: 'fa fa-desktop',
      fullPath: '/Workorder'
    },
    component: Layout,
    redirect: '/Workorder/Watchmanlist',
    children: [
      {
        path: 'Watchmanlist',
        name: 'WorkorderWatchmanlist',
        component: () => import('@/views/Workorder/Watchmanlist'),
        meta: {
          title: '工作列表',
          icon: 'fa fa-th-large',
          roles: ['EnterSystem'],
          fullPath: '/Workorder/Watchmanlist'
        }
      },
      {
        path: 'Checkedlist',
        name: 'WorkorderCheckedlist',
        component: () => import('@/views/Workorder/Checkedlist'),
        meta: {
          title: '已完成工单查询',
          icon: 'fa fa-th-large',
          roles: ['EnterSystem'],
          fullPath: '/Workorder/Checkedlist'
        }
      },
      {
        path: 'CheckedInfo/:id',
        name: 'WorkorderCheckedInfo',
        component: () => import('@/views/Workorder/CheckedInfo'),
        meta: {
          title: '已完成工单详情',
          icon: 'fa fa-home',
          roles: ['EnterSystem'],
          hidden: true,
          fullPath: '/Workorder/CheckedInfo'
        }
      },
      {
        path: 'MaintainerRob/:id',
        name: 'WorkorderMaintainerRob',
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
        name: 'WorkorderMaintainerAddRecord',
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
        name: 'WorkorderMaintainerReceipt',
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
        name: 'WorkorderMaintainerChangeOrder',
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
        name: 'WorkorderAcceptorOperate',
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
        name: 'WorkorderAuditorOperate',
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
      icon: 'fa fa-tasks',
      fullPath: '/assets'
    },
    component: Layout,
    redirect: '/assets/list',
    children: [
      {
        path: 'list',
        name: 'Assetslist',
        meta: {
          title: '资产列表',
          icon: 'fa fa-th-large',
          roles: ['ManageAsset'],
          fullPath: '/assets/list'
        },
        component: () => import('@/views/assets/list')
      },
      {
        path: 'Info/:id',
        name: 'AssetsInfo',
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
        name: 'AssetsCreate',
        meta: {
          title: '新增资产',
          icon: 'fa fa-th-large',
          roles: ['ManageAsset'],
          fullPath: '/assets/Create'
        },
        component: () => import('@/views/assets/Create')
      },
      {
        path: 'AssetField',
        name: 'AssetsAssetField',
        meta: {
          title: '资产自定义属性',
          icon: 'fa fa-th-large',
          roles: ['ManageAsset'],
          fullPath: '/assets/AssetField'
        },
        component: () => import('@/views/assets/AssetField')
      }
    ]
  },

  // 清单相关
  {
    path: '/Inventory',
    name: 'Inventory',
    meta: {
      title: '清单管理',
      icon: 'fa fa-sitemap',
      fullPath: '/Inventory'
    },
    component: Layout,
    redirect: '/Inventory/List',
    children: [
      {
        path: 'list',
        name: 'Inventorylist',
        meta: {
          title: '清单列表',
          icon: 'fa fa-th-large',
          roles: ['EquipmentList'],
          fullPath: '/Inventory/List'
        },
        component: () => import('@/views/Inventory/List')
      },
      {
        path: 'Info/:id',
        name: 'InventoryInfo',
        meta: {
          title: '清单详情',
          icon: 'fa fa-home',
          roles: ['EquipmentList'],
          hidden: true,
          fullPath: '/Inventory/Info'
        },
        component: () => import('@/views/Inventory/Info')
      },
      {
        path: 'Update/:id',
        name: 'InventoryUpdate',
        meta: {
          title: '生成清单详情',
          icon: 'fa fa-home',
          roles: ['EquipmentList'],
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
      icon: 'fa fa-plug',
      fullPath: '/SparePart'
    },
    component: Layout,
    redirect: '/SparePart/List',
    children: [
      {
        path: 'SparePartList',
        name: 'SparePartListList',
        component: () => import('@/views/SparePart/sparePartList'),
        meta: {
          title: '备品备件管理',
          icon: 'fa fa-th-large',
          roles: ['SpareNameManage'],
          fullPath: '/SparePart/sparePartList'
        }
      },
      {
        path: 'StoreroomList',
        name: 'StoreroomListList',
        component: () => import('@/views/SparePart/StoreroomList'),
        meta: {
          title: '库房管理',
          icon: 'fa fa-th-large',
          roles: ['SpareRepositoryManage'],
          fullPath: '/SparePart/StoreroomList'
        }
      },
      {
        path: 'InstantInventory',
        name: 'InstantInventoryList',
        component: () => import('@/views/SparePart/InstantInventory'),
        meta: {
          title: '即时库存',
          icon: 'fa fa-th-large',
          roles: ['SpareStockManage'],
          fullPath: '/SparePart/InstantInventory'
        }
      },
      {
        path: 'InstockList',
        name: 'InstockListList',
        component: () => import('@/views/SparePart/InstockList'),
        meta: {
          title: '入库单查看',
          icon: 'fa fa-th-large',
          roles: ['SpareInboundManage'],
          fullPath: '/SparePart/InstockList'
        }
      },
      {
        path: 'OutstockList',
        name: 'OutstockListList',
        component: () => import('@/views/SparePart/OutstockList'),
        meta: {
          title: '出库单查看',
          icon: 'fa fa-th-large',
          roles: ['SpareOutboundManage'],
          fullPath: '/SparePart/OutstockList'
        }
      },
      {
        path: 'AllocationList',
        name: 'AllocationListList',
        component: () => import('@/views/SparePart/AllocationList'),
        meta: {
          title: '调拨申请',
          icon: 'fa fa-th-large',
          roles: ['TransferApplication'],
          fullPath: '/SparePart/AllocationList'
        }
      },
      {
        path: 'AllocationCheck',
        name: 'AllocationCheckList',
        component: () => import('@/views/SparePart/AllocationCheck'),
        meta: {
          title: '调拨申请单审批',
          icon: 'fa fa-th-large',
          roles: ['TransferApplicationReview'],
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
      icon: 'fa fa-wrench',
      fullPath: '/maintenance'
    },
    component: Layout,
    redirect: '/maintenance/WatchmanAssetslist',
    children: [
      {
        path: 'WatchmanAssetslist',
        name: 'MaintenanceWatchmanAssetslist',
        component: () => import('@/views/maintenance/WatchmanAssetslist'),
        meta: {
          title: '维修单录入',
          icon: 'fa fa-th-large',
          roles: ['CreateRepairOrder'],
          fullPath: '/maintenance/WatchmanAssetslist'
        }
      },
      {
        path: 'WatchmanDispatch/:id',
        name: 'MaintenanceWatchmanDispatch',
        component: () => import('@/views/maintenance/WatchmanDispatch'),
        meta: {
          title: '值班人员派单',
          icon: 'fa fa-home',
          roles: ['Staff'],
          hidden: true,
          fullPath: '/maintenance/WatchmanDispatch'
        }
      },
      {
        path: 'WatchmanDispatchs/:id',
        name: 'MaintenanceWatchmanDispatchs',
        component: () => import('@/views/maintenance/WatchmanDispatchs'),
        meta: {
          title: '值班人员派单',
          icon: 'fa fa-home',
          roles: ['Staff'],
          hidden: true,
          fullPath: '/maintenance/WatchmanDispatchs'
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
      icon: 'fa fa-puzzle-piece',
      fullPath: '/Repairmanage'
    },
    component: Layout,
    redirect: '/Repairmanage/List',
    children: [
      {
        path: 'RepairplanList',
        name: 'RepairplanListList',
        component: () => import('@/views/Repairmanage/RepairplanList'),
        meta: {
          title: '维护计划',
          icon: 'fa fa-th-large',
          roles: ['MaintenancePlan'],
          fullPath: '/Repairmanage/RepairplanList'
        }
      },
      {
        path: 'RepairtaskList',
        name: 'RepairtaskListList',
        component: () => import('@/views/Repairmanage/RepairtaskList'),
        meta: {
          title: '维护任务',
          icon: 'fa fa-th-large',
          roles: ['MaintenanceTask'],
          fullPath: '/Repairmanage/RepairtaskList'
        }
      },
      {
        path: 'RepaircheckList',
        name: 'RepaircheckListList',
        component: () => import('@/views/Repairmanage/RepaircheckList'),
        meta: {
          title: '维护验收',
          icon: 'fa fa-th-large',
          roles: ['MaintenanceReview'],
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
      icon: 'fa fa-database',
      fullPath: '/Budgetmanage',
      roles: ['BudgetManage']
    },
    component: Layout,
    redirect: '/Budgetmanage/List',
    children: [
      {
        path: 'HardwareMaintenance',
        name: 'HardwareMaintenanceList',
        component: () => import('@/views/Budgetmanage/HardwareMaintenance'),
        meta: {
          title: '硬件维护单价管理',
          icon: 'fa fa-th-large',
          roles: ['UnitPriceManage'],
          fullPath: '/Budgetmanage/HardwareMaintenance'
        }
      },
      {
        path: 'HardwareMaintenanceInfo/:id',
        name: 'HardwareMaintenanceInfo',
        component: () => import('@/views/Budgetmanage/HardwareMaintenanceInfo'),
        meta: {
          title: '硬件维护单价详情',
          icon: 'fa fa-home',
          roles: ['UnitPriceManage'],
          hidden: true,
          fullPath: '/Budgetmanage/HardwareMaintenanceInfo'
        }
      },
      {
        path: 'SoftwareMaintenance',
        name: 'SoftwareMaintenanceList',
        component: () => import('@/views/Budgetmanage/SoftwareMaintenance'),
        meta: {
          title: '软件维护单价管理',
          icon: 'fa fa-th-large',
          roles: ['UnitPriceManage'],
          fullPath: '/Budgetmanage/SoftwareMaintenance'
        }
      },
      {
        path: 'SoftwareMaintenanceInfo/:id',
        name: 'SoftwareMaintenanceInfo',
        component: () => import('@/views/Budgetmanage/SoftwareMaintenanceInfo'),
        meta: {
          title: '软件维护单价详情',
          icon: 'fa fa-home',
          roles: ['UnitPriceManage'],
          hidden: true,
          fullPath: '/Budgetmanage/SoftwareMaintenanceInfo'
        }
      },
      {
        path: 'Informationsafety',
        name: 'InformationsafetyList',
        component: () => import('@/views/Budgetmanage/Informationsafety'),
        meta: {
          title: '信息安全单价管理',
          icon: 'fa fa-th-large',
          roles: ['UnitPriceManage'],
          fullPath: '/Budgetmanage/Informationsafety'
        }
      },
      {
        path: 'InformationsafetyInfo/:id',
        name: 'InformationsafetyInfo',
        component: () => import('@/views/Budgetmanage/InformationsafetyInfo'),
        meta: {
          title: '信息安全单价详情',
          icon: 'fa fa-home',
          roles: ['UnitPriceManage'],
          hidden: true,
          fullPath: '/Budgetmanage/InformationsafetyInfo'
        }
      },
      {
        path: 'HardwareRepair',
        name: 'HardwareRepairList',
        component: () => import('@/views/Budgetmanage/HardwareRepair'),
        meta: {
          title: '硬件维修单价管理',
          icon: 'fa fa-th-large',
          roles: ['UnitPriceManage'],
          fullPath: '/Budgetmanage/HardwareRepair'
        }
      },
      {
        path: 'HardwareRepairInfo/:id',
        name: 'HardwareRepairInfo',
        component: () => import('@/views/Budgetmanage/HardwareRepairInfo'),
        meta: {
          title: '硬件维修单价详情',
          icon: 'fa fa-home',
          roles: ['UnitPriceManage'],
          hidden: true,
          fullPath: '/Budgetmanage/HardwareRepairInfo'
        }
      },
      {
        path: 'SoftwareRepair',
        name: 'SoftwareRepairList',
        component: () => import('@/views/Budgetmanage/SoftwareRepair'),
        meta: {
          title: '软件维修单价管理',
          icon: 'fa fa-th-large',
          roles: ['UnitPriceManage'],
          fullPath: '/Budgetmanage/SoftwareRepair'
        }
      },
      {
        path: 'SoftwareRepairInfo/:id',
        name: 'SoftwareRepairInfo',
        component: () => import('@/views/Budgetmanage/SoftwareRepairInfo'),
        meta: {
          title: '软件维修单价管理',
          icon: 'fa fa-home',
          roles: ['UnitPriceManage'],
          hidden: true,
          fullPath: '/Budgetmanage/SoftwareRepairInfo'
        }
      },
      {
        path: 'ContractList',
        name: 'ContractEndListList',
        component: () => import('@/views/Budgetmanage/ContractList'),
        meta: {
          title: '合同测算预算',
          icon: 'fa fa-th-large',
          roles: ['BudgetManage'],
          fullPath: '/Budgetmanage/ContractList'
        }
      },
      {
        path: 'ContractInfo/:id',
        name: 'ContractEndListInfo',
        component: () => import('@/views/Budgetmanage/ContractInfo'),
        meta: {
          title: '合同测算预算详情',
          icon: 'fa fa-home',
          roles: ['BudgetManage'],
          hidden: true,
          fullPath: '/Budgetmanage/ContractInfo'
        }
      },
      {
        path: 'EquipmentQuota',
        name: 'EquipmentQuotaList',
        component: () => import('@/views/Budgetmanage/EquipmentQuota'),
        meta: {
          title: '设备定额名称匹配',
          icon: 'fa fa-th-large',
          roles: ['BudgetManage'],
          fullPath: '/Budgetmanage/EquipmentQuota'
        }
      },
      {
        path: 'Rateinformation',
        name: 'RateinformationList',
        component: () => import('@/views/Budgetmanage/Rateinformation'),
        meta: {
          title: '费率信息管理',
          icon: 'fa fa-th-large',
          roles: ['TariffManage'],
          fullPath: '/Budgetmanage/Rateinformation'
        }
      },
      {
        path: 'RateinformationInfo/:id',
        name: 'RateinformationInfo',
        component: () => import('@/views/Budgetmanage/RateinformationInfo'),
        meta: {
          title: '费率信息详情',
          icon: 'fa fa-home',
          hidden: true,
          roles: ['TariffManage'],
          fullPath: '/Budgetmanage/RateinformationInfo'
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
      icon: 'fa fa-user',
      fullPath: '/User'
    },
    component: Layout,
    redirect: '/User/list',
    children: [
      {
        path: 'list',
        name: 'Userlist',
        component: () => import('@/views/User/list'),
        meta: {
          title: '用户管理',
          icon: 'fa fa-th-large',
          roles: ['CreateUser'],
          fullPath: '/User/list'
        }
      }
    ]
  },
  // 元数据相关 权限已调整
  {
    path: '/Meta',
    name: 'Meta',
    meta: {
      title: '设置',
      icon: 'fa fa-cog',
      fullPath: '/Meta'
    },
    component: Layout,
    redirect: '/Meta/Type',
    children: [
      {
        path: 'brandModel',
        name: 'MetabrandModel',
        meta: {
          title: '品牌型号',
          icon: 'fa fa-th-large',
          roles: ['ManageMeta'],
          fullPath: '/Meta/brandModel'
        },
        component: () => import('@/views/Meta/brandModel')
      },
      {
        path: 'Type',
        name: 'MetaType',
        meta: {
          title: '设备类型',
          icon: 'fa fa-th-large',
          roles: ['ManageMeta'],
          fullPath: '/Meta/Type'
        },
        component: () => import('@/views/Meta/Type')
      },
      {
        path: 'Source',
        name: 'MetaSource',
        meta: {
          title: '设备来源',
          icon: 'fa fa-th-large',
          roles: ['ManageMeta'],
          fullPath: '/Meta/Source'
        },
        component: () => import('@/views/Meta/Source')
      },
      {
        path: 'Equipment',
        name: 'MetaEquipment',
        meta: {
          title: '设备管理',
          icon: 'fa fa-th-large',
          roles: ['ManageMeta'],
          fullPath: '/Meta/Equipment'
        },
        component: () => import('@/views/Meta/Equipment')
      },
      {
        path: 'System',
        name: 'MetaSystem',
        meta: {
          title: '设备系统',
          icon: 'fa fa-th-large',
          roles: ['ManageMeta'],
          fullPath: '/Meta/System'
        },
        component: () => import('@/views/Meta/System')
      },
      {
        path: 'SI',
        name: 'MetaSI',
        meta: {
          title: '设备集成商',
          icon: 'fa fa-th-large',
          roles: ['ManageMeta'],
          fullPath: '/Meta/SI'
        },
        component: () => import('@/views/Meta/SI')
      },
      {
        path: 'positionType',
        name: 'MetapositionType',
        meta: {
          title: '位置类型',
          icon: 'fa fa-th-large',
          roles: ['ManageMeta'],
          fullPath: '/Meta/positionType'
        },
        component: () => import('@/views/Meta/positionType')
      },
      {
        path: 'position',
        name: 'Metaposition',
        meta: {
          title: '位置管理',
          icon: 'fa fa-th-large',
          roles: ['ManageMeta'],
          fullPath: '/Meta/position'
        },
        component: () => import('@/views/Meta/Position')
      },
      {
        path: 'Fault',
        name: 'MetaFault',
        meta: {
          title: '故障管理',
          icon: 'fa fa-th-large',
          roles: ['ManageMeta'],
          fullPath: '/Meta/Fault'
        },
        component: () => import('@/views/Meta/Fault')
      },
      {
        path: 'RepairLevel',
        name: 'MetaRepairLevel',
        meta: {
          title: '维修等级管理',
          icon: 'fa fa-th-large',
          roles: ['ManageMeta'],
          fullPath: '/Meta/RepairLevel'
        },
        component: () => import('@/views/Meta/RepairLevel')
      },
      {
        path: 'Unit',
        name: 'MetaUnit',
        meta: {
          title: '部门管理',
          icon: 'fa fa-th-large',
          roles: ['ManageUnit'],
          fullPath: '/Meta/Unit'
        },
        component: () => import('@/views/Meta/Unit')
      },
      {
        path: 'Role',
        name: 'MetaRole',
        meta: {
          title: '角色管理',
          icon: 'fa fa-th-large',
          roles: ['ManageRole'],
          fullPath: '/Meta/Role'
        },
        component: () => import('@/views/Meta/Role')
      },
      {
        path: 'NormEquipment',
        name: 'MetaNormEquipment',
        meta: {
          title: '定额名称',
          icon: 'fa fa-th-large',
          roles: ['ManageMeta'],
          fullPath: '/Meta/NormEquipment'
        },
        component: () => import('@/views/Meta/NormEquipment')
      },
      {
        path: 'Claims',
        name: 'MetaClaims',
        meta: {
          title: '权限列表',
          icon: 'fa fa-th-large',
          roles: ['ManageRole'],
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
  },
  emergencyRepairRoutes,
  devopsAssessRoutes,
  integrityRateRoutes,
  repairStatisticsRoutes,
  maintenanceSuperviseRoutes
]

const routers = [...constantRoutes, ...asyncRoutes]
export default routers
