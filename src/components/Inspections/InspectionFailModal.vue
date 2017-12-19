<template>

  <div class="ui small modal" id="fail_inspection_modal">
    <i class="close icon"></i>
    <div class="header">Inspection Failed</div>
    <div>
      {% verbatim %}
      <div>
        <span>Inspection Authority:</span>
        <a :href="ticket.inspector_url" v-show="ticket.inspector_url">
          <span> {{ ticket.inspector_name }}</span>
          <span v-show="ticket.inspector_phone"> ({{ ticket.inspector_phone }})</span>
        </a>
        <div v-show="!ticket.inspector_url">
          <span> {{ ticket.inspector_name }}</span>
          <span v-show="ticket.inspector_phone"> ({{ ticket.inspector_phone }})</span>
        </div>
      </div>
      <div>
        <span>House Address</span>
        <span>{{ ticket.house_address }}</span>
      </div>
      {% endverbatim %}
    </div>
    <form class="ui form padding30">
      <div class="field">
        <label>Date Failed</label>
        <input type="date" v-model="ticket.inspection_date_failed">
      </div>
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="fail">
        Inspection Failed
        <i class="checkmark icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ticket: {},
    }
  },
  mounted: function() {

    $(this.$el).modal({closeable: false});
  },
  methods: {
    open: function(data) {
      this.$set('ticket', {
        inspection_id: data.inspection_id,
        inspection_date_failed: moment().format('YYYY-MM-DD'),
      });

      $(this.$el).modal('show');
    },
    fail: function(event) {
      var data = {
        data: this.ticket,
      };
      var url = BPC.routes['inspections.fail'];
      $.post(url, data, function(data) {
        BPC.overhang(data.message, data.success, 2);
        if (data.success) {
          $(this.$el).modal('hide');
          BPC.inspections.update();
        }
      }.bind(this), 'json');
    },
  },
}
</script>
