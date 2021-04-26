import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 网络发送数据
import axios from './net/my-http'
// import axios from 'axios'
// axios.defaults.baseURL = 'http://123.57.194.18:8080/'
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
