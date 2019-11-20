/* Layout */
import Layout from '@/layout'

// 完好率统计
const integrityRateRoutes = {
  path: '/maintenanceSupervise',
  name: 'maintenanceSupervise',
  component: Layout,
  redirect: '/maintenanceSupervise/internalExamination',

  meta: {
    title: '运维监督管理',
    icon: 'fa el-icon-s-claim',
    fullPath: '/maintenanceSupervise'
  },

  children: [
    {
      path: 'internalExamination',
      component: () => import('@/views/maintenanceSupervise/internalExamination'),
      name: 'maintenanceSupervise-internalExamination',
      meta: {
        title: '内部考核设置',
        icon: 'fa fa-circle-o',
        roles: ['ManageAsset'],
        fullPath: '/maintenanceSupervise/internalExamination'
      }
    },
    {
      path: 'examinationInquire',
      component: () => import('@/views/maintenanceSupervise/examinationInquire'),
      name: 'maintenanceSupervise-examinationInquire',
      meta: {
        title: '内部工作考核查询',
        icon: 'fa fa-circle-o',
        roles: ['ManageAsset'],
        fullPath: '/maintenanceSupervise/examinationInquire'
      }
    }
  ]
}

export default integrityRateRoutes
