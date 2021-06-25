// 基于axios封装的请求模块
import axios from 'axios'
import Vue from 'vue'
import router from '@/router'

const request = axios.create({
    baseURL: 'http://api-toutiao-web.itheima.net/',    // 请求的基础路径
})

let loading;
//内存中正在请求的数量
let loadingNum=0;
export const startLoading = targetdq => {    
	if(loadingNum==0){
		loading = Vue.prototype.$loading({
      lock: true,
      customClass: 'create-isLoading',
      text: 'Loading',
      color: '#ccc',
      spinner: 'el-icon-loading',
      background:'rgba(255,255,255,0.5)',
      target: document.querySelector(targetdq)
		})
	}
	//请求数量加1
	loadingNum++;
}
export const endLoading = () => {
  //请求数量减1
	loadingNum--
	if(loadingNum<=0){
		loading.close()
	}
}

// 请求拦截器
request.interceptors.request.use(function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'));
    if(user){
        config.headers.Authorization = `Bearer ${user.token}`
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

// 响应拦截器
request.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    if(error.response && error.response.status == 401){
      router.push('/login')
      window.localStorage.removeItem('user')
    }
    return Promise.reject(error);
  });

export default request