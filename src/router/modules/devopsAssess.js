/* Layout */
import Layout from '@/layout'

// 应急抢修
const devopsAssessRoutes = {
  path: '/devopsAssess',
  name: 'devopsAssess',
  component: Layout,
  redirect: '/devopsAssess/assess',
  meta: {
    title: '运维指标考核',
    icon: 'fa fa-fax',
    fullPath: '/devopsAssess'
  },

  children: [
    {
      path: 'assess',
      component: () => import('@/views/devopsAssess/assess'),
      name: 'DevopsAssessAssess',
      meta: {
        title: '运维指标考核',
        icon: 'fa fa-circle-o',
        roles: ['ManageAsset'],
        fullPath: '/devopsAssess/assess'
      }
    },
    {
      path: 'view',
      component: () => import('@/views/devopsAssess/view'),
      name: 'DevopsAssessView',
      meta: {
        title: '运维指标查询',
        icon: 'fa fa-circle-o',
        roles: ['ManageAsset'],
        fullPath: '/devopsAssess/view'
      }
    },
    {
      path: 'weight',
      component: () => import('@/views/devopsAssess/weight'),
      name: 'DevopsAssessWeight',
      meta: {
        title: '权重系数管理',
        icon: 'fa fa-circle-o',
        roles: ['ManageAsset'],
        fullPath: '/devopsAssess/weight'
      }
    }
  ]
}

export default devopsAssessRoutes
