/*
 * 引入需要的样式文件
 */
import 'normalize.css'
import 'flex.css'
import './iconfont/iconfont.css'
import 'github-markdown-css'
import './css/common.css'
import './less/common.less'

import Vue from 'vue'
import VueRouter from 'vue-router'
/*
 * 引入路由映射
 */
import routes from './config/routes'
/*
 * 引入vuex
 */
import stores from './stores/'
/*
 * 引入写好的filters以便下面注册过滤器
 */
import * as filters from './filters/'
/*
 * 引入scrollRecord以便下面注册指令
 */
import { scrollRecord } from 'route-data'
/*
 * 加载公共组件
 */
import components from './components/'
/*
 * 引入基本的全局config
 */
import configs from 'configs'
// console.log('Object.keys(components)', Object.keys(components))
/*
 * Object.keys(obj),获得obj的属性集合，返回一个数组，在下面就是通过这种方法注册组件和过滤器
 * 例：Object.keys(components) ["header", "content", "footer", "dataNull", "loading"]
 */
Object.keys(components).forEach((key) => {
  /*
   * 首字母大写
   */
  var name = key.replace(/(\w)/, (v) => v.toUpperCase())
  /*
   * 分别注册每一个component
   */
  Vue.component(`v${name}`, components[key])
})
/*
 * 注册过滤器
 */
Object.keys(filters).forEach(k => Vue.filter(k, filters[k])) //
Vue.use(VueRouter)
/*
 * 注册指令
 */
Vue.directive('scroll-record', scrollRecord)
/*
 * 声明vue-router的模式和基本配置
 */
const router = new VueRouter({
  routes,
  mode: 'history',
  base: configs.base
})
/*
 * 通过router.beforeEach 注册一个全局的 before 钩子，其实标准的参数是router.beforeEach((to, from, next)，
 * 这里使用了解构赋值，直接提取出meta和path,因为在下面也只是用到了to的这两个属性，虽然这样可读性差了一点，但是语义性也是有的
 * 在这里，其实主要是做了一个全局拦截器，使未登录用户其能够跳到登录页面
 * 注意必须调用next(),否则路由永远不会被 resolved
 */
router.beforeEach(({ meta, path }, from, next) => {
  const { auth = true } = meta
  const isLogin = Boolean(stores.state.user.accesstoken) // true用户已登录， false用户未登录
  // console.log('isLogin', isLogin)
  if (auth && !isLogin && path !== '/login') {
    let to = { path: '/login' }
    return next(to)
  }
  next()
})

new Vue({ store: stores, router }).$mount('#app')
