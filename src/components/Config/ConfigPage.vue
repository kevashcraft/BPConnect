<template>
  <div>
    <div class="page-container">
      <table ref="table" class="ui celled table"></table>
    </div>
    <config-user-modal ref="ConfigUserModal"></config-user-modal>
    <config-subdivision-modal ref="ConfigSubdivisionModal" @update="list"></config-subdivision-modal>
    <config-task-template-modal ref="ConfigTaskTemplateModal"></config-task-template-modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import ConfigUserModal from './ConfigUserModal.vue'
  import ConfigSubdivisionModal from './ConfigSubdivisionModal.vue'
  import ConfigTaskTemplateModal from './ConfigTaskTemplateModal.vue'

  export default {
    components: {
      ConfigUserModal,
      ConfigSubdivisionModal,
      ConfigTaskTemplateModal
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
    computed: mapState(['config']),
    watch: {
      config () {
        this.tableInit()
      },
    },
    methods: {
      tableInit () {
        if (this.table) {
          this.table.destroy()
        }

        var config = {
          responsive: true,
          columns: this.config.columns,
          paging: false,
          dom: 't',
        }

        this.table = $(this.$refs.table).DataTable(config)

        $(this.$refs.table).on('click', 'tr', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs[this.config.modal].open(data)
        })

        this.list()
      },
      list () {
        this.$root.req(this.config.list).then(response => {
          this.table.clear()
          this.table.rows.add(response)
          this.table.draw()
        })
      },
    },
  }
</script>
