import Vue from 'vue'
import App from './App.vue'
import data from './data'
import methods from './methods'
import mounted from './mounted'
import router from './router'
import store from './store'
import './imports'

new Vue({
  el: '#app',
  data,
  methods,
  router,
  store,
  mounted,
  render (h) { return h(App) }
})
