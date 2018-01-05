<template>
  <div class="ui tiny modal">
    <i class="close icon"></i>
    <div class="header">Send Out Ticket</div>
    <div class="content">
      <div class="ui icon message">
        <i class="arrow right icon"></i>
        <div class="content">
          <div class="header">Start the Job</div>
          <p>Send out the plumbers to start the work</p>
        </div>
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
      afterOpen (ticket) {
        this.ticket = ticket
      },
      update () {
        this.$root.req('Schedule:updateSentout', this.ticket).then((response) => {
          if (response) {
            this.$root.noty('Ticket has been sent out')
            this.$emit('update')
            this.close()
          } else {
            this.$root.noty('Could not send out ticket', 'error')
          }
        })
      },
    }
  }
</script>
