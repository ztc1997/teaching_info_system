import Vue from 'vue'
import Vuex from 'vuex'
import {SET_USER, SET_CSRF_TOKEN, CLEAR_USER} from './mutation-types'
import {LOAD_USER} from './action-types'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    CSRFToken: '',
    user: {
      id: -1,
      username: '',
      userType: -1
    }
  },
  mutations: {
    [SET_USER](state, user) {
      state.user = user
    },
    [SET_CSRF_TOKEN](state, CSRFToken) {
      state.CSRFToken = CSRFToken
    },
    [CLEAR_USER](state) {
      state.CSRFToken = ''
      state.user.id = -1
      state.user.username = ''
      state.user.userType = -1
    }
  },
  actions: {
    [LOAD_USER](context) {
      return new Promise((resolve, reject) => {
        axios.get('/user').then((response) => {
          if (response.data.ok) {
            context.commit(SET_USER, response.data.data)
            resolve()
          } else {
            reject(response.data.err)
          }
        }).catch((error) => {
          reject(error)
        })
      })
    }
  },
  plugins: [createPersistedState({
    storage: window.localStorage,
    reducer(val) {
      return {
        CSRFToken: val.CSRFToken,
        user: val.user
      }
    }
  })]
})
