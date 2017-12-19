<template>

  <div class="ui small modal" id="supplier_add_modal">
    <i class="close icon"></i>
    <div class="header">Add Supplier</div>
    <form class="ui form padding30 center aligned">
      <div class="field">
        <label>Name</label>
        <input type="text" v-model="supplier.name">
      </div>
      <div class="field">
        <label>Address</label>
        <input type="text" v-model="supplier.address">
      </div>
      <div class="field">
        <label>Phone Number</label>
        <input type="text" v-model="supplier.phone">
      </div>
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green button" @click="add">Add</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      supplier: {},
    }
  },
  mounted: function() {
    $(this.$el).modal({allowMultiple: true});
  },
  methods: {
    open: function() {
      this.$set('supplier', {
        name     : '',
        address  : '',
        phone    : '',
      });
      $(this.$el).modal('show');
    },
    add: function() {
      var data = { data: this.supplier };
      $.post(BPC.r.orders.supplier_add, data, function (data) {
        BPC.overhang(data.message, data.success);
        if (data.success) {
          $(this.$el).modal('hide');
        }
      }.bind(this), 'json');
    },
  }
}
</script>
