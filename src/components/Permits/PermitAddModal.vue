<template>
  <div class="ui small modal" id="permit_add_modal">
    <i class="close icon"></i>
    <div class="header">Add a Permit</div>
    <form class="ui form padding30">
      <div class="field fluid">
        <div class="ui search">
          <label>Inspection Authority</label>
          <input type="text" class="prompt">
        </div>
      </div>
      <div class="field">
        <label>Permit Number</label>
        <input type="text" v-model="permit.name">
      </div>
      <div class="two fields">
        <div class="field">
          <label>Start Date</label>
          <input type="date" v-model="permit.starts">
        </div>
        <div class="field">
          <label>End Date</label>
          <input type="date" v-model="permit.ends">
        </div>
      </div>
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="add">
        Add Permit
        <i class="checkmark icon"></i>
      </div>
    </div>
  </div>

</template>
<script>
  export default {
    data () {
      return {
        wip: {
          ticket_id : 0,
        },
      }
    },
    mounted: function() {

      $(this.$el).modal({allowMultiple: true});
      $('#permit_add_modal .ui.search').search({
        apiSettings: {
          url: BPC.routes['permits.inspectors_search'] + '?query={query}',
          method: 'post'
        },
        selectFirstResult: true,
        onSelect: function (result, response) {
          this.permit.inspector_id = result.id;
        }.bind(this),
      });
    },
    methods: {
      open: function(data) {
        this.$set('permit', {
          permit_id: data.permit_id,
          starts: moment().format('YYYY-MM-DD'),
          ends: moment().add('days', 60).format('YYYY-MM-DD'),
        });

        $(this.$el).modal('show');
      },
      add: function(event) {
        if (!this.permit.inspector_id) BPC.overhang('Please select an inspector', false);
        if (!this.permit.starts) BPC.overhang('Please add a start date', false);
        if (!this.permit.ends) BPC.overhang('Please add an end date', false);
        var data = {
          data: this.permit,
        };
        var url = BPC.routes['permits.add'];
        $.post(url, data, function(data) {
          BPC.overhang(data.message, data.success, 2);
          if (data.success) {
            $(this.$el).modal('hide');
            BPC.permits.permits_table.row(this.row).data(data.inspection);
          }
        }.bind(this), 'json');
      },
      supplier_add_modal: function () {
        BPC.permits.supplier_add_modal.open();
      },
    }
  }
</script>