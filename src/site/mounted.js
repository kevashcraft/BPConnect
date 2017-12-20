export default function () {
  this.$store.dispatch('modalClear')

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
}
