import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import {
  setToken,
  getToken,
  setTitle
} from '@/libs/util'


Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
});

const INDEX_PAGE_NAME = 'index'
const LOGIN_PAGE_NAME = 'loginBack'
const LOGIN_NAME = 'login'
const homeName = 'home'
const  ERROR = 'error_404'




/*在跳转之前执行*/
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  //一.未登录的时候，1跳转不需要登录的页面（index，backlogin）处理方式直接进入  2跳转需要登录的页面（home）处理方式，需要生成路由，这个时候路由里面没有，直接跳转到前台登录页
  //1跳转不需要登录的页面
  if (!token) {
    if(to.name==null){
      next({
        name:LOGIN_PAGE_NAME
      })
    } else{
      next()
    } 
  } else if (token) {
    //二，登录的时候，如果刷新浏览器，会将路由的信息刷新掉，所以手动调用获取用户信息的接口，同时更新前端路由
    if (store.state.user.newRoutes.length === 0) {
      if (to.name === LOGIN_PAGE_NAME) {
        next({
          name: homeName
        })
      } else {
        store.dispatch('getUserInfo').then(() => {
          // hack方法 确保addRoutes已完成 (...解构赋值)         
          next({ ...to,replace: true})
        }).catch((err) => {
          console.log(err);
          setToken('')
          next({
            name: LOGIN_PAGE_NAME
          })
        })
      }
    } else {
      next() //当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
    }
  }
})

router.afterEach(to => {
  // setTitle(to, router.app)  
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
