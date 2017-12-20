<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Inspection Failed</div>
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
        <label>Date Failed</label>
        <input type="date" v-model="ticket.inspectionDateFailed">
      </div>
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="update">
        Inspection Failed
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
        name: 'InspectionFailModal'
      },
      ticket: {},
    }
  },
  mounted: function() {

    $(this.$el).modal({closeable: false})
  },
  methods: {
    afterOpen ({row, data}) {
      this.ticket = {
        inspectionId: data.inspectionId,
        inspectionDateFailed: moment().format('YYYY-MM-DD'),
      }

    },
    update (event) {
      // var data = {
      //   data: this.ticket,
      // }
      // var url = BPC.routes['inspections.fail']
      // $.post(url, data, function(data) {
      //   BPC.overhang(data.message, data.success, 2)
      //   if (data.success) {
      //     $(this.$el).modal('hide')
      //     BPC.inspections.update()
      //   }
      // }.bind(this), 'json')
    },
  },
}
</script>
