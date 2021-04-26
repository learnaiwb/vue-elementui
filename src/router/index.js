import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'

import storage from '../net/myUtils/storage'
import welcome from '../components/welcome'
import users from '../components/users/user'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', redirect: '/login'
  },
  {
    path: '/login', component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: welcome
      },
      {
        path: '/users',
        component: users
      },
      {
        path: '/roles',
        component: () => import('../components/users/roles')
      },
      {
        path: '/rights',
        component: () => import('../components/users/rights')
      }
    ]
  }
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
