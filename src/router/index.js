import Vue from 'vue'
import VueRouter from 'vue-router'

import storage from '../net/myUtils/storage'
import { permissionConfig } from './permissionConfig'
import { defaultRoutes } from './defaultConfig'

Vue.use(VueRouter)

const routes = [
  ...permissionConfig,
  ...defaultRoutes
]

const router = new VueRouter({
  routes
})
/**
 * to 将要访问的路径
 * from 从哪个路径而来
 * next 放行
 */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  if (storage.getItem('token')) {
    console.log('含有token跳转')
    next()
  } else {
    next('/login')
  }
})
export default router
