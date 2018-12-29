import Vue from 'vue'
import Router from 'vue-router'
import ProjectManagement from '../components/ProjectManagement'
import UserManagement from '../components/UserManagement'
import Login from '../components/Login'
import Page404 from '../components/Page404'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/projectManagement',
      name: 'projectManagement',
      component: ProjectManagement,
      meta: {
        showToolBar: true,
        requiresAuth: true,
        title: '课题管理',
      }
    },
    {
      path: '/userManagement',
      name: 'userManagement',
      component: UserManagement,
      meta: {
        showToolBar: true,
        requiresAuth: true,
        title: '用户管理',
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        showToolBar: false,
        requiresAuth: false,
        title: '用户登录',
      }
    },
    {
      path: '/404',
      name: '404',
      component: Page404,
      alias: '*',
      meta: {
        showToolBar: false,
        requiresAuth: false,
        title: '404 Not Found',
      }
    },
    {path: '/', redirect: '/projectManagement'}
  ]
})
