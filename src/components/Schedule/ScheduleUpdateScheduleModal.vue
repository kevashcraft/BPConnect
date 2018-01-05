<template>
  <div class="ui tiny modal">
    <i class="close icon"></i>
    <div class="header">Reschedule Ticket</div>
    <div class="content">
      <div class="ui icon message">
        <i class="calendar icon"></i>
        <div class="content">
          <div class="header">Change Ticket Date</div>
          <p>Select the new date for this job.</p>
        </div>
      </div>
      <div class="ui red message" v-show="ticket.bumpedCount">Ticket has already been rescheduled {{ ticket.bumpedCount }} time<span v-show="ticket.bumpedCount > 1">s</span>.</div>
      <form class="ui form padding30">
        <div class="field">
          <label>Date Scheduled</label>
          <input type="date" v-model="ticket.ticketDateScheduled">
        </div>
  <!--       <div class="field">
          <label>Email Builder</label>
          <div class="ui toggle checkbox">
            <input type="checkbox" v-model="ticket.sendEmail">
            <label>Send Email</label>
          </div>
        </div> -->
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
    </div>
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
      ticket: {},
    }
  },
  methods: {
    afterOpen (ticket) {
      // var ticket = data
      // ticket.sendEmail = false
      // ticket.emailSubject = 'Ticket has been rescheduled'
      ticket.ticketDateScheduled = moment(ticket.ticketDateScheduled).format('YYYY-MM-DD')
      this.ticket = ticket
    },
    submit (event) {
      this.$root.req('Schedule:updateScheduled', this.ticket).then((response) => {
        if (response) {
          this.$root.noty('Ticket has been reschedueld')
          this.$emit('update')
          this.close()
        } else {
          this.$root.noty('Could not reschedule ticket', 'error')
        }
      })
    },
  }
}
</script>
