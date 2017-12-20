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
    modalStackPush (state, modal) {
      if (state.modalStack.indexOf(modal) < 0) {
        state.modalStack.push(modal)
      }
    },
    modalStackSet (state, stack) {
      this.modalStack = stack
    },
    modalStackSplice (state, index) {
      state.modalStack.splice(index, 1)
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
    modalClear ({ commit }) {
      commit('modalSet', '')
      commit('modalStackSet', [])
    },
    modalOpen ({ commit, state }, modal) {
      // remove if in the stack
      let prevIndex = state.modalStack.indexOf(modal)
      if (prevIndex > -1) commit('modalStackSplice', prevIndex)

      commit('modalSet', modal)
    },
    modalNext ({ commit, state }) {
      // commit('modalEmpty')
      let modal = ''

      if (state.modalStack.length) {
        modal = state.modalStack[0]

        setTimeout(() => {
          commit('modalStackSplice', 0)
        }, 350)
      }

      commit('modalSet', modal)
    },
    modalSave ({ commit, state }, modal) {
      console.log("modal", modal)
      if (modal !== state.modal) {
        commit('modalStackPush', state.modal)
        commit('modalSet', modal)
      } else {
        console.log("you're trying to save the wrong modal")
      }

    }
  }
})
