// 路由拦截器
import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import cookies from '@/libs/cookies'

// 路由数据
import routes from './index'

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  mode: 'history',
  routes
})
// 判断权限是否匹配
function hasRoles(routes, roles) {
  const needroles = routes.meta.roles // Array
  return roles.includes(needroles[0])
}

const whiteList = ['/login', '/auth-redirect', '/401', '/404', '/index', '/myjob'] // no roles whitelist

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach((to, from, next) => {
  // 进度条
  NProgress.start()

  const token = cookies.get('accessToken') // 通过cookie获取登录凭证token
  const roles = cookies.get('roles').split(',') // 通过cookie 获取权限 roles
  // 根据token roles whiteList判断是否需要检查权限  判断是否已存在token  是否已获取到当前登录用户权限  此页面路由是否需要检查权限
  const needCheckRoles = token && roles.length >= 1 && whiteList.indexOf(to.path) === -1
  if (needCheckRoles) {
    if (hasRoles(to, roles)) {
      next()
    } else {
      next({
        name: '401',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    if (!token) {
      // 没有token前往登录
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
    } else if (to.meta.noCheckRoles) {
      // 不需要检查权限直接前往
      next()
    } else if (roles.length < 1) {
      // 权限长度小于1 ,没有获取到权限 前往401
      next({
        name: '401',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
})

export default router
