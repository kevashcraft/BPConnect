<template>

  <div class="ui small modal" id="reason_add_modal">
    <i class="close icon"></i>
    <div class="header">Add Reason</div>
    <form class="padding30 center aligned">
      <div class="field">
        <div class="ui input">
          <label>Reason</label>
          <input type="text" v-model="reason.reason" placeholder="Reason">
        </div>
      </div>
      <div class="field">
        <div class="ui slider checkbox">
          <label>Builder's Fault</label>
          <input type="checkbox" v-model="reason.builders_fault">
        </div>
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
  data: {
    reason: {},
  },
  ready: function() {
    $(this.$el).modal({allowMultiple: true});
  },
  methods: {
    open: function() {
      this.$set('reason', {
        reason: '',
        builders_fault: false,
      });
      $(this.$el).modal('show');
    },
    add: function() {
      var data = { reason: this.reason };
      $.post(BPC.r.sites.reason_add, data, function (data) {
        BPC.overhang(data.message, data.success);
        if (data.success) {
          $(this.$el).modal('hide');
        }
      }.bind(this), 'json');
    },
  }
}
</script>
