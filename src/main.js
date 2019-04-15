// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router';
import router from './router'
import axios from 'axios'
import config from '@/config'
import Vuex from 'vuex'
import iView from 'iview'
import 'iview/dist/styles/iview.css';
import UserAxios from './axios'
import store from './store'
import {
  getToken,
  getMenuByPermissions,
  setToken
} from '@/libs/util'

Vue.config.productionTip = false;
Vue.use(iView);
Vue.prototype.$ajax = axios;

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

/* eslint-disable no-new */
// const url = "http://localhost:7788/system/user/getCurrentUser"
new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})





                 
// if (!getToken()) {
// } else {
//   //解决浏览器刷新后，动态路由消失，在渲染页面之前提前赋值动态路由
//   fetch(url, {
//       method: "get",
//       mode: 'cors',
//       headers: {
//         "Content-type": "application:/x-www-form-urlencoded:charset=UTF-8",
//         "token": getToken()
//       },
//     })
//     .then(res => {
//       //token过期后，后端返回新token，重新赋值token     
//       setToken(res.headers.get("token") === null ? getToken() : res.headers.get("token"))   
//       return res.json();
//     }).then(json => {
//       //在addroutes后，router.options.routes不会更新,手动添加 问题 会将整个侧边栏导航重新加载一遍，导致回到首页
//       let routes = [];
//       getMenuByPermissions(routes, json.data.permissions)
//       store.state.user.newRoutes = routes
//       // 添加路由
//       router.addRoutes(routes.concat([
//           { path: '*',
//             name: 'error_404',
//             meta: {
//               hideInMenu: true
//             },
//             component: () => import('@/view/error-page/404.vue')
//           }
//       ]))
//       new Vue({
//         el: '#app',
//         store,
//         router,
//         components: {
//           App
//         },
//         template: '<App/>'
//       })
//     }).catch(err => {
//       setToken('')
//       console.log('请求错误', err);
//   })
// }
