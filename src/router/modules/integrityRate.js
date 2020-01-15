/* Layout */
import Layout from '@/layout'

// 完好率统计
const integrityRateRoutes = {
  path: '/integrityRate',
  name: 'integrityRate',
  component: Layout,
  redirect: '/integrityRate/systemStatistics',

  meta: {
    title: '完好率统计管理',
    icon: 'fa el-icon-s-data',
    fullPath: '/integrityRate'
  },

  children: [
    {
      path: 'systemStatistics',
      component: () => import('@/views/integrityRate/systemStatistics'),
      name: 'IntegrityRateSystemStatistics',
      meta: {
        title: '所属系统完好率统计',
        icon: 'fa fa-circle-o',
        roles: ['ManageAsset'],
        fullPath: '/integrityRate/systemStatistics'
      }
    },
    {
      path: 'electromechanical',
      component: () => import('@/views/integrityRate/electromechanical'),
      name: 'IntegrityRateElectromechanical',
      meta: {
        title: '机电设备完好率统计',
        icon: 'fa fa-circle-o',
        roles: ['ManageAsset'],
        fullPath: '/integrityRate/electromechanical'
      }
    },
    {
      path: 'average',
      component: () => import('@/views/integrityRate/average'),
      name: 'IntegrityRateAverage',
      meta: {
        title: '平均完好率统计',
        icon: 'fa fa-circle-o',
        roles: ['ManageAsset'],
        fullPath: '/integrityRate/average'
      }
    },
    {
      path: 'averageRanking',
      component: () => import('@/views/integrityRate/averageRanking'),
      name: 'IntegrityRateAverageRanking',
      meta: {
        title: '平均完好率统计Top10',
        icon: 'fa fa-circle-o',
        roles: ['ManageAsset'],
        fullPath: '/integrityRate/averageRanking'
      }
    },
    {
      path: 'equipmentAverage',
      component: () => import('@/views/integrityRate/equipmentAverage'),
      name: 'IntegrityRateEquipmentAverage',
      meta: {
        title: '设备平均完好率统计',
        icon: 'fa fa-circle-o',
        roles: ['ManageAsset'],
        fullPath: '/integrityRate/equipmentAverage'
      }
    }
  ]
}

export default integrityRateRoutes
