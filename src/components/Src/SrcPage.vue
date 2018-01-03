<template>
  <div>
    <div class="page-container">
      <table ref="table" class="ui celled table"></table>
    </div>
    <src-update-modal ref="SrcUpdateModal" @update="list"></src-update-modal>
    <src-reason-add-modal ref="SrcReasonAddModal"></src-reason-add-modal>
  </div>
</template>

<script>
  import Page from '../Page/Page'
  import SrcColumns from './SrcColumns'
  import SrcUpdateModal from './SrcUpdateModal.vue'
  import SrcReasonAddModal from './SrcReasonAddModal.vue'

  export default {
    mixins: [ Page ],
    components: {
      SrcUpdateModal,
      SrcReasonAddModal
    },
    data () {
      return {
        meta: {
          name: 'SrcPage',
          title: 'Site Ready Checklist'
        },
        src: [],
      }
    },
    methods: {
      init () {
        this.initTable()
        this.list()
      },
      list () {
        this.$root.req('Src:list', this.filters).then(response => {
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
          columns: SrcColumns,
          paging: false,
          dom: 'Bt',
          buttons: [ { extend: 'colvis', text: 'Visible Columns', className: 'ui button' } ]
        }

        this.table = $(this.$refs.table).DataTable(config)
        if (this.src) {
          var rows = $.extend(true, [], this.src)
          this.table.rows.add(rows)
          this.table.draw()
        }

        this.moveColumnsButton()

        $(this.$refs.table).on('click', 'a[href="#site_ready"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.SrcUpdateModal.open({data, row})
        })

      },
    },
  }
</script>
