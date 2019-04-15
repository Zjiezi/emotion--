import axios from 'axios'
import qs from 'qs'
import store from './store'
import { getToken } from '@/libs/util'




// axios 配置
axios.defaults.baseURL = 'http://localhost:7788'; // 配置接口地址
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.withCredentials = false;

// axios.defaults.headers.common['Token'] = getToken();
  



//添加请求拦截器
axios.interceptors.request.use((config) => { 
  if(getToken()){
    config.headers.common['Token']=getToken();
    }
 //POST传参序列化
  if (config.method === 'post') {
    config.data = qs.stringify(config.data);
  }
  return config;
}, (error) => {
  return promises.reject(error);
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
  //对响应数据做些事
  return res;
}, (error) => {
  return Promise.reject(error);
});


