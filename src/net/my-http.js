import axios from 'axios'
import storage from './myUtils/storage'

const instance = axios.create({
  baseURL: 'http://123.57.194.18:8080/',
  timeout: 10000,
  withCredentials: false
})
instance.interceptors.request.use(config => {
  console.log('config=', config)
  config.headers = {
    authorization: storage.getItem('token') || ''
  }
  return config
}, error => {
  return Promise.reject(error)
})
instance.interceptors.response.use(response => {
  console.log('response=', response)
  if (response.config.url === 'login') {
    storage.setItem('token', response.data.token)
  }
  return response.data
}, (error) => {
  console.log('error=>', error)
  return Promise.reject(error)
})
export default instance
