import axios from 'axios'
import {
  localRead,
  localSave,
  setToken,
  getToken,
  getMenuByPermissions
} from '@/libs/util'

import router from '@/router'
import routers from '@/router/routers'


export default {
  state: {
    userName: '',
    userId: '',
    token: getToken(),
    newRoutes:[]

  },
  mutations: {
    setUserId(state, id) {
      state.userId = id
    },
    setUserName(state, name) {
      state.userName = name
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    setRouter(state, addrouter) {
      //在addroutes后，router.options.routes不会更新,手动添加 
      let routes = [];
      getMenuByPermissions(routes, addrouter)
      state.newRoutes = routes
      router.addRoutes(routes.concat([
        { path: '*',
          name: 'error_404',
          meta: {
            hideInMenu: true
          },
          component: () => import('@/view/error-page/404.vue')
        }
    ]))  // 添加路由 
    }
  },
  actions: {
    // 登录
    handleLogin({
      commit
    }, {
      userName,
      password
    }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        const data = {
          username: userName,
          password
        }
        axios.request({
          url: 'login',
          data,
          method: 'post'
        }).then(res => {
          const data = res.data.data     
          if (res.data.code == 0) {
            //当切换用户登录时，存入token和user身份，同时去更新tagNaveList，如果是相同用户登录，tagNaveList会保存出上次打开的页面，如果更换用户，则请空tagNaveList
            commit('setToken', res.headers.token) 
            let user = localRead('User') 
            if(user!=data.userName){
              localSave('tagNaveList','')
            }
            localSave('User',data.userName)
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        axios.request({
          url: 'quitLogin',
          method: 'get'
        }).then(res => {
          commit('setToken', '')  
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 获取用户相关信息
    getUserInfo({state, commit}) {        
      return new Promise((resolve, reject) => {
        try {
          axios.request({
            url: '/system/user/getCurrentUser',
            method: 'get'
          }).then(res => {
            const data = res.data.data            
            commit('setToken', res.headers.token ===undefined ? state.token : res.headers.token )           
            commit('setUserName', data.userName)
            commit('setRouter', data.permissions)
            resolve()
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },

    // // 获取消息列表，其中包含未读、已读、回收站三个列表
    // getMessageList({
    //   state,
    //   commit
    // }) {
    //   return new Promise((resolve, reject) => {
    //     getMessage().then(res => {
    //       const {
    //         unread,
    //         readed,
    //         trash
    //       } = res.data
    //       commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
    //       commit('setMessageReadedList', readed.map(_ => {
    //         _.loading = false
    //         return _
    //       }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
    //       commit('setMessageTrashList', trash.map(_ => {
    //         _.loading = false
    //         return _
    //       }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // // 根据当前点击的消息的id获取内容
    // getContentByMsgId({
    //   state,
    //   commit
    // }, {
    //   msg_id
    // }) {
    //   return new Promise((resolve, reject) => {
    //     let contentItem = state.messageContentStore[msg_id]
    //     if (contentItem) {
    //       resolve(contentItem)
    //     } else {
    //       getContentByMsgId(msg_id).then(res => {
    //         const content = res.data
    //         commit('updateMessageContentStore', {
    //           msg_id,
    //           content
    //         })
    //         resolve(content)
    //       })
    //     }
    //   })
    // },
    // // 把一个未读消息标记为已读
    // hasRead({
    //   state,
    //   commit
    // }, {
    //   msg_id
    // }) {
    //   return new Promise((resolve, reject) => {
    //     hasRead(msg_id).then(() => {
    //       commit('moveMsg', {
    //         from: 'messageUnreadList',
    //         to: 'messageReadedList',
    //         msg_id
    //       })
    //       commit('setMessageCount', state.unreadCount - 1)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // // 删除一个已读消息到回收站
    // removeReaded({
    //   commit
    // }, {
    //   msg_id
    // }) {
    //   return new Promise((resolve, reject) => {
    //     removeReaded(msg_id).then(() => {
    //       commit('moveMsg', {
    //         from: 'messageReadedList',
    //         to: 'messageTrashList',
    //         msg_id
    //       })
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // // 还原一个已删除消息到已读消息
    // restoreTrash({
    //   commit
    // }, {
    //   msg_id
    // }) {
    //   return new Promise((resolve, reject) => {
    //     restoreTrash(msg_id).then(() => {
    //       commit('moveMsg', {
    //         from: 'messageTrashList',
    //         to: 'messageReadedList',
    //         msg_id
    //       })
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // }
  }
}
