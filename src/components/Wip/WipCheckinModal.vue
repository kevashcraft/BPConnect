<template>

  <div class="ui small modal" id="wip_checkin_modal">
    <i class="close icon"></i>
    <div class="header">Checkin Work</div>
    <form class="ui form padding30">
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="checkin">
        Checkin Ticket
        <i class="external share icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      row: {},
      wip: {},
    }
  },
  mounted: function() {

    $(this.$el).modal({
      closeable: false
    });
  },
  methods: {
    open: function(data, row) {
      this.row  = row;
      this.$set('wip', {
        ticket_id: data.ticket_id,
        // starts: moment().format('YYYY-MM-DD'),
      });

      $(this.$el).modal('show');
    },
    checkin: function(event) {
      var data = {
        data: this.wip,
      };
      $.post(BPC.routes['wip.checkin'], data, function(data) {
        BPC.overhang(data.message, data.success, 2);
        if (data.success) {
          $(this.$el).modal('hide');
          BPC.wip.update();
        }
      }.bind(this), 'json');
    },
  },
}
</script>
