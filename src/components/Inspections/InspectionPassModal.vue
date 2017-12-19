<template>

  <div class="ui small modal" id="pass_inspection_modal">
    <i class="close icon"></i>
    <div class="header">Inspection Passed</div>
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
        <label>Date Passed</label>
        <input type="date" v-model="ticket.inspection_date_passed">
      </div>
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="pass">
        Passed Inspection
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
        inspection_date_passed: moment().format('YYYY-MM-DD'),
      });

      $(this.$el).modal('show');
    },
    pass: function(event) {
      var data = {
        data: this.ticket,
      };
      var url = BPC.routes['inspections.pass'];
      $.post(url, data, function(data) {
        BPC.overhang(data.message, data.success, 2);
        if (data.success) {
          $(this.$el).modal('hide');
          BPC.inspections.inspections_table.row(this.row).data(data.inspection);
        }
      }.bind(this), 'json');
    },
  },
}
</script>
