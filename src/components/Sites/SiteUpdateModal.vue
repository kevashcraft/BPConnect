<template>

  <div class="ui small modal" id="site_update_modal">
    <i class="close icon"></i>
    <div class="header">Update Site</div>
    <form class="ui form padding30">
      <div class="field fluid">
        <div class="ui slider checkbox">
          <label>Site <span v-show="!site.ready">not</span> ready</label>
          <input type="checkbox" v-model="site.ready">
        </div>
      </div>
      <div class="two fields">
        <div class="field" v-show="!site.ready">
          <div class="ui search">
            <label>Reason not Ready</label>
            <input type="text" class="prompt">
          </div>
        </div>
        <div class="field" v-show="!site.ready">
          <div class="ui button" @click="reason_add_modal">Add</div>
        </div>
      </div>
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="update">
        Update Site
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
      site: {},
    }
  },
  mounted: function() {

    $('#site_update_modal .ui.checkbox').checkbox();
    $(this.$el).modal({allowMultiple: true});
    $('#site_update_modal .ui.search').search({
      apiSettings: {
        url: BPC.r.sites.reasons_search + '?query={query}',
        method: 'post'
      },
      selectFirstResult: true,
      onSelect: function (result, response) {
        this.site.reason_id = result.id;
      }.bind(this),
    });
  },
  methods: {
    open: function(data, row) {
      this.row  = row;
      this.$set('site', {
        ticket_id: data.ticket_id,
        reason_id: null,
        ready    : false,
      });

      $('#site_update_modal .ui.search').search('set value', '');
      $(this.$el).modal('show');
    },
    update: function(event) {
      if (!this.site.ready && !this.site.reason_id) BPC.overhang('Please add a reason', false);

      var data = {
        site: this.site,
      };
      $.post(BPC.r.sites.update, data, function(data) {
        BPC.overhang(data.message, data.success, 2);
        if (data.success) {
          $(this.$el).modal('hide');
          BPC.sites.sites_table.row(this.row).data(data.site);
        }
      }.bind(this), 'json');
    },
    reason_add_modal: function () {
      BPC.sites.reason_add_modal.open();
    },
  }
}
</script>
