<template>
  <div>
    <config-user-modal ref="ConfigUserModal"></config-user-modal>
    <config-subdivision-modal ref="ConfigSubdivisionModal"></config-subdivision-modal>
    <config-task-template-modal ref="ConfigTaskTemplateModal"></config-task-template-modal>
  </div>
</template>

<script>
  import Page from '../Page/Page'
  import ConfigUserModal from './ConfigUserModal.vue'
  import ConfigSubdivisionModal from './ConfigSubdivisionModal.vue'
  import ConfigTaskTemplateModal from './ConfigTaskTemplateModal.vue'

  export default {
    mixins: [ Page ],
    components: {
      ConfigUserModal
      ConfigSubdivisionModal
      ConfigTaskTemplateModal
    },
    data () {
      return {
        meta: {
          name: 'ConfigPage',
          title: 'Config'
        },
        selected: '',
      }
    },
    mounted () {
      if (window.location.hash) {
        var selected = window.location.hash.replace('#', '')
      } else {
        var selected = 'user'
      }
      BPC.configControls.$set('selected', selected)
    },
    watch: {
      selected: function(selected) {
        this.update()
      },
    },
    methods: {
      update () {
        var options = JSON.parse(JSON.stringify(BPC.configControls.options))
        var selected = this.selected
        if (!options.some(function(property) { return property.value === selected })) {
          selected = 'user'
        }

        if (this.selected !== selected) {
          BPC.configControls.$set('selected', selected)
        }

        var url = BPC.routes['config'] + '#' + selected
        history.pushState(null, null, url)

        var data = {
          selected: selected,
        }
        var route = 'config.' + [selected] + '.list'
        route = BPC.routes[route]
        $.post(route, data, function (data) {

          var table = $('#configTable')
          if (table) table.remove()

          var container = $('#tableContainer')
          container.append('<table id="configTable" class="ui celled table"></table>')
          $('#configTable').on('click', 'tr', function(event) {
            var table = BPC.config.configTable
            var data = table.row(this).data()
            var modal = BPC.config.selected + 'Modal'
            BPC.config[modal].open(data)
          })
          this.configTable = $('#configTable').DataTable({
            paging: false,
            data: data.rows,
            columns: data.columns,
            dom: 't',
          })
        }.bind(this), "json")
      },
    },
  }
</script>
