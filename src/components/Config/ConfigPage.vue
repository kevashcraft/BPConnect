<template>
  <div>
    <div class="page-container"></div>
    <config-user-modal ref="ConfigUserModal"></config-user-modal>
    <config-builder-modal ref="ConfigBuilderModal" @update="list"></config-builder-modal>
    <config-inspector-modal ref="ConfigInspectorModal" @update="list"></config-inspector-modal>
    <config-subdivision-modal ref="ConfigSubdivisionModal" @update="list"></config-subdivision-modal>
    <config-supplier-modal ref="ConfigSupplierModal" @update="list"></config-supplier-modal>
    <config-task-template-modal ref="ConfigTaskTemplateModal"></config-task-template-modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import ConfigBuilderModal from './ConfigBuilderModal.vue'
  import ConfigInspectorModal from './ConfigInspectorModal.vue'
  import ConfigSubdivisionModal from './ConfigSubdivisionModal.vue'
  import ConfigSupplierModal from './ConfigSupplierModal.vue'
  import ConfigTaskTemplateModal from './ConfigTaskTemplateModal.vue'
  import ConfigUserModal from './ConfigUserModal.vue'

  export default {
    components: {
      ConfigBuilderModal,
      ConfigInspectorModal,
      ConfigSubdivisionModal,
      ConfigSupplierModal,
      ConfigTaskTemplateModal,
      ConfigUserModal
    },
    data () {
      return {
        meta: {
          name: 'ConfigPage',
          title: 'Config'
        },
      }
    },
    mounted () {
      this.$store.commit('pageTitleSet', this.meta.title)
    },
    computed: mapState(['config', 'configDeleted']),
    watch: {
      config () {
        this.tableInit()
      },
      configDeleted () {
        this.list()
      },
    },
    methods: {
      tableInit () {
        if (this.table) {
          this.table.destroy()
        }
        $(this.$el).find('.page-container').empty()
          .append('<table class="ui celled table" width="100%"></table>')

        var config = {
          responsive: true,
          columns: this.config.columns,
          fixedHeader: true,
          paging: false,
          dom: 't',
        }

        this.table = $(this.$el).find('.page-container table').DataTable(config)

        $(this.$el).find('.page-container table').on('click', 'tr', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs[this.config.modal].open(data)
        })

        this.list()
      },
      list () {
        this.$root.req(this.config.list, { deleted: this.configDeleted }).then(response => {
          this.table.clear()
          this.table.rows.add(response)
          this.table.draw()
        })
      },
    },
  }
</script>
