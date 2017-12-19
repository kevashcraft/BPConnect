<template>
  <div class="ui small modal" id="parts_received_modal">
    <i class="close icon"></i>
    <div class="header">Parts Received</div>
    <form class="ui form padding30">
      {% verbatim %}
      <div v-for="part in parts" class="padding5">
        <div class="ui slider checkbox part">
          <input type="checkbox" v-model="part.received">
          <label>{{ part.description }}</label>
        </div>
      </div>
      {% endverbatim %}
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui blue button" @click="select_all">Select All</div>
      <div class="ui green icon button" @click="parts_received">
        Parts Received
        <i class="checkmark icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      order: {},
      parts: [],
      loading: true,
    }
  },
  methods: {
    open: function(data, row) {
      this.row  = row;
      this.data = data;
      this.$set('loading', true);

      $(this.$el).modal('show');
      this.get_parts();
    },
    get_parts: function() {
      var data = {ticket_id: this.data.ticket_id};
      $.post(BPC.r.orders.get_parts, data, function(data) {
        this.$set('parts', data.parts);
        setTimeout(function(){
          $('.ui.checkbox').checkbox();
        },100);
        setTimeout(function(){
          $(this.$el).modal('refresh');
        }.bind(this),250);
      }.bind(this), 'json');
    },
    parts_received: function(event) {
      var data = { parts: this.parts, };
      $.post(BPC.r.orders.parts_received, data, function(data) {
        BPC.overhang(data.message, data.success, 2);
        if (data.success) {
          $(this.$el).modal('hide');
          BPC.orders.orders_table.row(this.row).data(data.order);
        }
      }.bind(this), 'json');
    },
    select_all: function() {
      $('.ui.checkbox.part').checkbox('check');
    },
    supplier_add_modal: function () {
      BPC.orders.supplier_add_modal.open();
    },
  }
}
</script>
