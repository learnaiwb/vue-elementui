import Home from '../components/Home'
import welcome from '../components/welcome'
import users from '../components/users/user'

export const permissionConfig = [
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
        component: () => import('../components/power/rights')
      }
    ]
  }
]
