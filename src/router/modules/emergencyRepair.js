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
        roles: ['EmergencyRequisitionRecord'],
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
        roles: ['EmergencyRequisitionReview'],
        fullPath: '/emergencyRepair/approval'
      }
    },
    {
      path: 'cost',
      component: () => import('@/views/emergencyRepair/cost'),
      name: 'emergencyRepair-cost',
      meta: {
        title: '应急抢修费用申请',
        icon: 'fa fa-circle-o',
        roles: ['EmergencyWorkCostRecord'],
        fullPath: '/emergencyRepair/cost'
      }
    },
    {
      path: 'costApproval',
      component: () => import('@/views/emergencyRepair/costApproval'),
      name: 'emergencyRepair-costApproval',
      meta: {
        title: '应急抢修费用审批',
        icon: 'fa fa-circle-o',
        roles: ['EmergencyWorkCostReview'],
        fullPath: '/emergencyRepair/costApproval'
      }
    },
    {
      path: 'acceptance',
      component: () => import('@/views/emergencyRepair/acceptance'),
      name: 'emergencyRepair-acceptance',
      meta: {
        title: '应急抢修验收申请',
        icon: 'fa fa-circle-o',
        roles: ['EmergencyAcceptanceRecord'],
        fullPath: '/emergencyRepair/acceptance'
      }
    },
    {
      path: 'acceptanceApproval',
      component: () => import('@/views/emergencyRepair/acceptanceApproval'),
      name: 'emergencyRepair-acceptanceApproval',
      meta: {
        title: '应急抢修验收审批',
        icon: 'fa fa-circle-o',
        roles: ['EmergencyAcceptanceReview'],
        fullPath: '/emergencyRepair/acceptanceApproval'
      }
    }
  ]
}

export default emergencyRepairRoutes
