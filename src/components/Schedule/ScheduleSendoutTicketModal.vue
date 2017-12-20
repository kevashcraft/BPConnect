<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Send Out Ticket</div>
    <div class="ui icon message">
      <i class="arrow right icon"></i>
      <div class="content">
        <p>Send out the plumbers to start the work</p>
      </div>
    </div>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="update">
        <span>Send Out</span>
        <i class="arrow right icon"></i>
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
          name: 'ScheduleSendoutTicketModal',
        },
        row: {},
        ticket: {},
      }
    },
    ready: function() {
    },
    methods: {
      open ({data, row}) {
        this.row = row
        let ticket = JSON.parse(JSON.stringify(data))

      },
      update () {
        // var data = {
        //   ticket_id: this.ticket.ticket_id,
        // }
        // var url = BPC.routes['schedule.sendout_ticket']
        // $.post(url, data, function(data) {
        //   BPC.overhang(data.message, data.success, 2)
        //   if (data.success) {
        //     $(this.$el).modal('hide')
        //     BPC.schedule.schedule_table.row(this.row).data(data.ticket)
        //   }
        // }.bind(this), 'json')
      },
    }
  }
</script>
