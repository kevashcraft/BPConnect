<template>
  <div>
    <div id="config" class="page-container">
      <div id="table_container"></div>
    </div>
  </div>
  <config-user-modal></config-user-modal>
  <config-subdivision-modal></config-subdivision-modal>
  <config-task-template-modal></config-task-template-modal>

</template>

<script>
  import ConfigUserModal from './ConfigUserModal.vue'
  import ConfigSubdivisionModal from './ConfigSubdivisionModal.vue'
  import ConfigTaskTemplateModal from './ConfigTaskTemplateModal.vue'

  export default {
    components: {
      ConfigUserModal
      ConfigSubdivisionModal
      ConfigTaskTemplateModal
    },
    data () {
      return {
        selected: '',
      }
    },
    mounted: function() {
      if (window.location.hash) {
        var selected = window.location.hash.replace('#', '');
      } else {
        var selected = 'user';
      }
      BPC.config_controls.$set('selected', selected);
    },
    watch: {
      selected: function(selected) {
        this.update();
      },
    },
    methods: {
      update: function() {
        var options = JSON.parse(JSON.stringify(BPC.config_controls.options));
        var selected = this.selected;
        if (!options.some(function(property) { return property.value === selected })) {
          selected = 'user';
        }

        if (this.selected !== selected) {
          BPC.config_controls.$set('selected', selected);
        }

        var url = BPC.routes['config'] + '#' + selected;
        history.pushState(null, null, url);

        var data = {
          selected: selected,
        };
        var route = 'config.' + [selected] + '.list';
        route = BPC.routes[route];
        $.post(route, data, function (data) {

          var table = $('#config_table');
          if (table) table.remove();

          var container = $('#table_container');
          container.append('<table id="config_table" class="ui celled table"></table>');
          $('#config_table').on('click', 'tr', function(event) {
            var table = BPC.config.config_table;
            var data = table.row(this).data();
            var modal = BPC.config.selected + '_modal';
            BPC.config[modal].open(data);
          });
          this.config_table = $('#config_table').DataTable({
            paging: false,
            data: data.rows,
            columns: data.columns,
            dom: 't',
          });
        }.bind(this), "json");
      },
    },
  }
</script>
