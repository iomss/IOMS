/* Layout */
import Layout from '@/layout'

// 应急抢修
const emergencyRepairRoutes = {
  path: '/emergencyRepair',
  name: 'emergencyRepair',
  component: Layout,
  redirect: '/emergencyRepair/apply',

  meta: {
    title: '应急抢修管理',
    icon: 'fa fa-fax',
    fullPath: '/emergencyRepair'
  },

  children: [
    {
      path: 'apply',
      component: () => import('@/views/emergencyRepair/apply'),
      name: 'emergencyRepair-apply',
      meta: {
        title: '应急抢修申请',
        icon: 'fa fa-circle-o',
        roles: ['ManageAsset'],
        fullPath: '/emergencyRepair/apply'
      }
    },
    {
      path: 'approval',
      component: () => import('@/views/emergencyRepair/approval'),
      name: 'emergencyRepair-approval',
      meta: {
        title: '应急抢修审批',
        icon: 'fa fa-circle-o',
        roles: ['ManageAsset'],
        fullPath: '/emergencyRepair/approval'
      }
    }
  ]
}

export default emergencyRepairRoutes
