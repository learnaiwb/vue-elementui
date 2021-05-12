import Login from '../components/Login'

export const defaultRoutes = [
  {
    path: '/', redirect: '/login'
  },
  {
    path: '/login', component: Login
  }
]
