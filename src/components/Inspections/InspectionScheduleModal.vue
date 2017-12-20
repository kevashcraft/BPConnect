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
      <div>
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
    afterOpen ({row, data}) {
      this.ticket = {
        inspectionId: data.inspectionId,
        inspectionDateScheduled: moment().format('YYYY-MM-DD'),
      }

    },
    update (event) {
      // var data = {
      //   data: this.ticket,
      // }
      // var url = BPC.routes['inspections.schedule']
      // $.post(url, data, function(data) {
      //   BPC.overhang(data.message, data.success, 2)
      //   if (data.success) {
      //     $(this.$el).modal('hide')
      //     BPC.inspections.inspectionsTable.row(this.row).data(data.inspection)
      //   }
      // }.bind(this), 'json')
    },
  },
}
</script>
