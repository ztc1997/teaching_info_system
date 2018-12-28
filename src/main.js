import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import router from './router'
import store from './store'
import axios from './http'

Vue.use(Vuetify)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.user.id < 0) {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
    next()
  }
  next()
})

router.afterEach((to) => {
  document.title = to.meta.title
})

new Vue({
  router,
  store,
  axios,
  render: h => h(App),
}).$mount('#app')
