import Vue         from 'vue'

import App         from './App.vue'
import router      from './router'
import store       from './store'

import * as imports from './imports'
import methods from './methods'

new Vue({
  el: '#app',
  methods,
  router,
  store,
  mounted () {
    this.req('TicketTypes:list').then(ticketTypes => {
      console.log("ticketTypes",ticketTypes);
      this.$store.commit('ticketTypesSet', ticketTypes)
    })

    this.req('BuilderSupervisors:list').then(builderSupervisorsAll => {
      let builderSupervisors = {}
      builderSupervisorsAll.forEach(builderSupervisor => {
        if (!(builderSupervisor.builderId in builderSupervisors)) {
          builderSupervisors[builderSupervisor.builderId] = []
        }

        builderSupervisors[builderSupervisor.builderId].push(builderSupervisor)
      })

      this.$store.commit('builderSupervisorsSet', builderSupervisors)
    })

    this.req('Workers:list').then(workers => {
      this.$store.commit('workersSet', workers)
    })
  },
  render (h) { return h(App) },
})
