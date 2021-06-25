import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less' 
import { startLoading, endLoading } from '@/utils/request.js'

Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$startLoading = startLoading
Vue.prototype.$endLoading = endLoading

// 创建Vue实例，把router配置到根实例中，通过render方法把App根组件渲染到入口节点
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
