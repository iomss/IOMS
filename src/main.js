import Vue from 'vue'

// css 标准化
import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

// 自定义样式文件
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router/router'

// 字体图标引入
import '@fortawesome/fontawesome-free/css/all.css'

// 引入cookie
import cookie from './libs/cookies'

// 引入axios
import axios from './libs/axios'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element)

Vue.config.productionTip = false

// 将cookie挂载到vue属性中
Vue.prototype.$cookie = cookie

// 将 axios 挂载到vue 属性中
Vue.prototype.$axios = axios

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
