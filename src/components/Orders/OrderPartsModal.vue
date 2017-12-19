<template>

  <div class="ui small modal" id="order_parts_modal">
    <i class="close icon"></i>
    <div class="header">Order Parts</div>
    <form class="ui form padding30">
      <div class="two fields">
        <div class="field">
          <div class="ui search">
            <label>Supplier</label>
            <input type="text" class="prompt" v-model="search">
          </div>
        </div>
        <div class="field">
          <div class="ui button" @click="supplier_add_modal">Add New</div>
        </div>
      </div>
      <div class="field">
        <label>Order Number</label>
        <input type="text" v-model="order.number">
      </div>
      <div class="field">
        <label>Total Cost</label>
        <input type="text" v-model="order.total" placeholder="Total Cost">
      </div>
      <div class="field">
        <label>Order Date</label>
        <input type="date" v-model="order.ordered" placeholder="Order Date">
      </div>
      {% verbatim %}
      <div v-for="part in parts">
        <div class="ui checkbox part">
          <label>{{ part.description }}</label>
          <input type="checkbox" v-model="part.ordered">
        </div>
      </div>
      {% endverbatim %}
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui blue button" @click="select_all">Select All</div>
      <div class="ui green icon button" @click="order_parts">
        Parts Ordered
        <i class="checkmark icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      row: {},
      order: {},
      parts: [],
    }
  },
  mounted: function() {

    $(this.$el).modal({allowMultiple: true});
    $('#order_parts_modal .ui.search').search({
      apiSettings: {
        url: BPC.r.orders.suppliers_search + '?query={query}',
        method: 'post'
      },
      selectFirstResult: true,
      onSelect: function (result, response) {
        console.log("result",result);
        this.order.supplier_id = result.id;
      }.bind(this),
    });
  },
  methods: {
    open: function(data, row) {
      this.row  = row;
      this.order = {
        ticket_id: data.ticket_id,
        number: '',
        total: '',
        parts: [],
        ordered  : moment().format('YYYY-MM-DD'),
      };
      this.$set('search', '');

      $(this.$el).modal('show');
      this.get_parts();
    },
    get_parts: function() {
      var data = {ticket_id: this.order.ticket_id};
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
    order_parts: function(event) {
      if (!this.order.supplier_id) BPC.overhang('Please select a supplier', false);
      var data = {
        order: this.order,
        parts: this.parts,
      };
      $.post(BPC.r.orders.order_parts, data, function(data) {
        BPC.overhang(data.message, data.success, 2);
        if (data.success) {
          $(this.$el).modal('hide');
          BPC.orders.update();
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
