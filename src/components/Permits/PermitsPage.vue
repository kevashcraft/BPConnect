<template>
  <div>
    <div class="page-container">
      <table ref="table" class="ui celled table"></table>
    </div>
    <permit-add-modal ref="PermitAddModal" @update="list"></permit-add-modal>
  </div>
</template>

<script>
  import Page from '../Page/Page'
  import PermitsColumns from './PermitsColumns'
  import PermitAddModal from './PermitAddModal.vue'

  export default {
    mixins: [ Page ],
    components: {
      PermitAddModal
    },
    data () {
      return {
        meta: {
          name: 'PermitsPage',
          title: 'Permits'
        }
      }
    },
    methods: {
      init () {
        this.initTable()
        this.list()
      },
      list () {
        this.$root.req('Permits:list', this.filters).then(response => {
          this.table.clear()
          this.table.rows.add(response)
          this.table.draw()
        })
      },

      initTable () {
        var config = {
          stateSave: true,
          colReorder: true,
          responsive: true,
          columns: PermitsColumns,
          paging: false,
          dom: 'Bt',
          buttons: [ { extend: 'colvis', text: 'Visible Columns', className: 'ui button' } ]
        }

        this.table = $(this.$refs.table).DataTable(config)
        if (this.permits) {
          var rows = $.extend(true, [], this.permits)
          this.table.rows.add(rows)
          this.table.draw()
        }

        this.moveColumnsButton()

        $(this.$refs.table).on('click', 'a[href="#permit_add"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.PermitAddModal.open({data, row})
        })
      },
    },
  }
</script>
