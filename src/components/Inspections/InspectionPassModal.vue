<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Inspection Passed</div>
    <div>
      <div>
        <span>Inspection Authority:</span>
        <a :href="ticket.inspectorUrl" v-show="ticket.inspectorUrl">
          <span> {{ ticket.inspectorName }}</span>
          <span v-show="ticket.inspectorPhone"> ({{ ticket.inspectorPhone }})</span>
        </a>
        <div v-show="!ticket.inspectorUrl">
          <span> {{ ticket.inspectorName }}</span>
          <span v-show="ticket.inspectorPhone"> ({{ ticket.inspectorPhone }})</span>
        </div>
      </div>
      <div v-show="ticket.houseAddress">
        <span>House Address</span>
        <span>{{ ticket.houseAddress }}</span>
      </div>
    </div>
    <form class="ui form padding30">
      <div class="field">
        <label>Date Passed</label>
        <input type="date" v-model="ticket.inspectionDatePassed">
      </div>
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="update">
        Passed Inspection
        <i class="checkmark icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from '../Modal/Modal'

export default {
  mixins: [ Modal ],
  data () {
    return {
      meta: {
        name: 'InspectionPassModal'
      },
      ticket: {},
    }
  },
  methods: {
    afterOpen (ticket) {
      ticket.inspectionDatePassed = moment().format('YYYY-MM-DD'),
      this.ticket = ticket
    },
    update () {
      this.$root.req('Inspections:updatePassed', this.ticket).then((response) => {
        if (response) {
          this.$root.noty('Inspection has been passed')
          this.$emit('update')
          this.close()
        } else {
          this.$root.noty('Could not pass inspection', 'error')
        }
      })
    },
  },
}
</script>
