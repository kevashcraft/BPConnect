<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Reschedule Ticket</div>
    <p class="padding30">Ticket has already been rescheduled {{ bumpedCount }} times.</p>
    <form class="ui form padding30">
      <div class="field">
        <label>Date Scheduled</label>
        <input type="date" v-model="ticket.date">
      </div>
      <div class="field">
        <label>Email Builder</label>
        <div class="ui toggle checkbox">
          <input type="checkbox" v-model="ticket.sendEmail">
          <label>Send Email</label>
        </div>
      </div>
      <div v-show="ticket.sendEmail">
        <div class="two fields">
          <div class="field">
            <label>To</label>
            <input type="text" v-model="ticket.builderName">
          </div>
          <div class="field">
            <label>Email Address</label>
            <input type="email" v-model="ticket.builderEmail">
          </div>
        </div>
        <div class="field">
          <label>Subject</label>
          <input type="text" v-model="ticket.emailSubject">
        </div>
        <div class="field">
          <label>Message</label>
          <textarea v-model="ticket.emailMessage"></textarea>
        </div>
      </div>
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="submit">
        <span>Reschedule</span>
        <span v-show="ticket.emailBuilder"> & Email</span>
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
        name: 'ScheduleUpdateScheduleModal'
      },
      bumpedCount: 0,
      row: {},
      ticket: 0,
    }
  },
  methods: {
    afterOpen ({data, row}) {
      this.row  = row
      var ticket = JSON.parse(JSON.stringify(data))
      ticket.sendEmail = true
      ticket.emailSubject = 'Ticket has been rescheduled'
      this.ticket = ticket
    },
    submit (event) {
      // var data = {
      //   data: this.ticket,
      // }
      // var url = BPC.routes['schedule.updateSchedule']
      // $.post(url, data, function(data) {
      //   BPC.overhang(data.message, data.success, 2)
      //   if (data.success) {
      //     $(this.$el).modal('hide')
      //     BPC.schedule.scheduleTable.row(this.row).data(data.ticket)
      //   }
      // }.bind(this), 'json')
    },
  }
}
</script>
