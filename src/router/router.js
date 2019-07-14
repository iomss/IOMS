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

const noRoleWhiteList = ['/login', '/401', '/404', '/index', '/myjob'] // 不需要权限
const noLoginWhitdList = ['/login', '/404', '/401'] // 不需要登录
/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach((to, from, next) => {
  // 进度条
  NProgress.start()

  const token = cookies.get('access_token') // 通过cookie获取登录凭证token
  const roles = cookies.get('roles') ? cookies.get('roles').split(',') : [] // 通过cookie 获取权限 roles

  const needCheckRoles = roles.length >= 1 && noRoleWhiteList.indexOf(to.path) === -1 // 判断是否需要权限 true 需要 false 不需要

  const needLogin = noLoginWhitdList.indexOf(to.path) === -1 // 判断是否需要登录 false 需要 true 不需要

  // 判断前往路径是否需要登录
  if (needLogin) {
    // 需要登录
    // 根据token是否存在判断是否已登录
    if (token) {
      // 存在
      // 判断是否需要权限
      if (needCheckRoles) {
        // 需要权限
        // 判断是否存在相关权限
        if (hasRoles(to, roles)) {
          // 存在直接前往
          next()
        } else {
          // 不存在前往401
          next({
            name: '401',
            query: {
              redirect: to.fullPath
            }
          })
        }
      } else {
        // 不需要权限直接前往
        next()
      }
    } else {
      // 不存在跳转登录
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    // 不需要登录
    next()
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
})

export default router
