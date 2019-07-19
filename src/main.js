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

// 引入jquery ajax 模块
import { ajax } from 'jquery'
// vue treeSelect 样式引入
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

// 时间格式化插件
import moment from 'moment'

Vue.use(Element)

Vue.config.productionTip = false

// 将cookie挂载到vue属性中
Vue.prototype.$cookie = cookie

// 将 axios 挂载到vue 属性中
Vue.prototype.$axios = axios
Vue.prototype.$ajax = ajax

// 时间日期格式话
Vue.prototype.$moment = moment

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
