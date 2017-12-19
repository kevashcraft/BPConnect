import Vue  from 'vue'
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [ persistedState() ],
  state: {
    builderSupervisors: {},
    filters: {},
    modal: '',
    modalStack: [],
    pageTitle: '',
    workers: [],
    ticketTypes: [],
  },
  mutations: {
    builderSupervisorsSet (state, builderSupervisors) {
      state.builderSupervisors = builderSupervisors
    },
    filtersSet (state, filters) {
      state.filters = filters
    },
    modalSet (state, modal) {
      state.modal = modal
    },
    modalEmpty (state) {
      state.modal = ''
    },
    pageTitleSet (state, title) {
      state.pageTitle = title
    },
    ticketTypesSet (state, ticketTypes) {
      state.ticketTypes = ticketTypes
    },
    workersSet (state, workers) {
      state.workers = workers
    },
  },
  actions: {
    modalOpen ({ commit }, modal) {
      commit('modalEmpty')
      commit('modalSet', modal)
    }
  }
})
