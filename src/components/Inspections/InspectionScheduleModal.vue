<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Schedule Inspection</div>
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
      <div v-show="!ticket.houseAddress">
        <span>House Address</span>
        <span>{{ ticket.houseAddress }}</span>
      </div>
    </div>
    <form class="ui form padding30">
      <div class="field">
        <label>Date Scheduled</label>
        <input type="date" v-model="ticket.inspectionDateScheduled">
      </div>
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="update">
        Schedule Inspection
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
        name: 'InspectionScheduleModal'
      },
      ticket: {},
    }
  },
  methods: {
    afterOpen (ticket) {
      if (!ticket.inspectionDateScheduled) {
        ticket.inspectionDateScheduled = moment().format('YYYY-MM-DD')
      }

      this.ticket = ticket
    },
    update (event) {
      this.$root.req('Inspections:updateScheduled', this.ticket).then((response) => {
        if (response) {
          this.$root.noty('Inspection has been scheduled')
          this.$emit('update')
          this.close()
        } else {
          this.$root.noty('Could not schedule inspection', 'error')
        }
      })
    },
  },
}
</script>
