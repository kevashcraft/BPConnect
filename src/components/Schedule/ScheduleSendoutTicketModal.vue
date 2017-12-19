<template>

  <div class="ui small modal" id="schedule_sendout_ticket_modal">
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
  export default {
    data () {
      return {
        row: {},
        ticket: {},
      }
    },
    ready: function() {
    },
    methods: {
      open: function(data, row) {
        this.row  = row;
        var ticket = JSON.parse(JSON.stringify(data));
        this.$set('ticket', ticket);

        $(this.$el).modal('show');
      },
      update: function(event) {
        var data = {
          ticket_id: this.ticket.ticket_id,
        };
        var url = BPC.routes['schedule.sendout_ticket'];
        $.post(url, data, function(data) {
          BPC.overhang(data.message, data.success, 2);
          if (data.success) {
            $(this.$el).modal('hide');
            BPC.schedule.schedule_table.row(this.row).data(data.ticket);
          }
        }.bind(this), 'json');
      },
    }
  }
</script>
