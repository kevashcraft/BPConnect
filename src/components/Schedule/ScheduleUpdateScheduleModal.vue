<template>

  <div class="ui small modal" id="schedule_update_schedule_modal">
    <i class="close icon"></i>
    <div class="header">Reschedule Ticket</div>
    {% verbatim %}
    <p class="padding30">Ticket has already been rescheduled {{ bumped_count }} times.</p>
    {% endverbatim %}
    <form class="ui form padding30">
      <div class="field">
        <label>Date Scheduled</label>
        <input type="date" v-model="ticket.date">
      </div>
      <div class="field">
        <label>Email Builder</label>
        <div class="ui toggle checkbox">
          <input type="checkbox" v-model="ticket.send_email">
          <label>Send Email</label>
        </div>
      </div>
      <div v-show="ticket.send_email">
        <div class="two fields">
          <div class="field">
            <label>To</label>
            <input type="text" v-model="ticket.builder_name">
          </div>
          <div class="field">
            <label>Email Address</label>
            <input type="email" v-model="ticket.builder_email">
          </div>
        </div>
        <div class="field">
          <label>Subject</label>
          <input type="text" v-model="ticket.email_subject">
        </div>
        <div class="field">
          <label>Message</label>
          <textarea v-model="ticket.email_message"></textarea>
        </div>
      </div>
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="update">
        <span>Reschedule</span>
        <span v-show="ticket.emailBuilder"> & Email</span>
        <i class="checkmark icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data () {
      return {
        row: {},
        ticket: 0,
      }
    },
    methods: {
      open: function(data, row) {
        this.row  = row;
        var ticket = JSON.parse(JSON.stringify(data));
        ticket.send_email = true;
        ticket.email_subject = 'Ticket has been rescheduled';
        this.$set('ticket', ticket);

        $(this.$el).modal('show');
        setTimeout(function () {
          $(this.$el).modal('refresh');
        }.bind(this), 500);
      },
      update: function(event) {
        var data = {
          data: this.ticket,
        };
        var url = BPC.routes['schedule.update_schedule'];
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
