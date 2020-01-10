/* Layout */
import Layout from '@/layout'

// 完好率统计
const repairStatisticsRoutes = {
  path: '/repairStatistics',
  name: 'repairStatistics',
  component: Layout,
  redirect: '/repairStatistics/equipmentFailure',

  meta: {
    title: '维修统计管理',
    icon: 'fa el-icon-s-marketing',
    fullPath: '/repairStatistics'
  },

  children: [
    {
      path: 'equipmentFailure',
      component: () => import('@/views/repairStatistics/equipmentFailure'),
      name: 'RepairStatisticsEquipmentFailure',
      meta: {
        title: '系统故障统计分析',
        icon: 'fa fa-circle-o',
        roles: ['ManageAsset'],
        fullPath: '/repairStatistics/equipmentFailure'
      }
    },
    {
      path: 'positionFault',
      component: () => import('@/views/repairStatistics/positionFault'),
      name: 'RepairStatisticsPositionFault',
      meta: {
        title: '位置故障统计分析',
        icon: 'fa fa-circle-o',
        roles: ['ManageAsset'],
        fullPath: '/repairStatistics/positionFault'
      }
    },
    {
      path: 'maintenanceLevel',
      component: () => import('@/views/repairStatistics/maintenanceLevel'),
      name: 'RepairStatisticsMaintenanceLevel',
      meta: {
        title: '按维修等级统计分析',
        icon: 'fa fa-circle-o',
        roles: ['ManageAsset'],
        fullPath: '/repairStatistics/maintenanceLevel'
      }
    },
    {
      path: 'faultGrade',
      component: () => import('@/views/repairStatistics/faultGrade'),
      name: 'RepairStatisticsFaultGrade',
      meta: {
        title: '按故障等级统计分析',
        icon: 'fa fa-circle-o',
        roles: ['ManageAsset'],
        fullPath: '/repairStatistics/faultGrade'
      }
    },
    {
      path: 'dateFaultLevel',
      component: () => import('@/views/repairStatistics/dateFaultLevel'),
      name: 'RepairStatisticsDateFaultLevel',
      meta: {
        title: '日期多维度故障统计分析',
        icon: 'fa fa-circle-o',
        roles: ['ManageAsset'],
        fullPath: '/repairStatistics/dateFaultLevel'
      }
    },
    {
      path: 'faultAnalysis',
      component: () => import('@/views/repairStatistics/faultAnalysis'),
      name: 'RepairStatisticsFaultAnalysis',
      meta: {
        title: '故障分析统计',
        icon: 'fa fa-circle-o',
        roles: ['ManageAsset'],
        fullPath: '/repairStatistics/faultAnalysis'
      }
    }
  ]
}

export default repairStatisticsRoutes
