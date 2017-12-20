<template>
  <div>
    <table ref="table" class="ui celled responsive table"></table>
    <site-update-modal ref="SiteUpdateModal"></site-update-modal>
    <site-reason-add-modal ref="SiteReasonAddModal"></site-reason-add-modal>
  </div>
</template>

<script>
  import Page from '../Page/Page'
  import SitesColumns from './SitesColumns'
  import SiteUpdateModal from './SiteUpdateModal.vue'
  import SiteReasonAddModal from './SiteReasonAddModal.vue'

  export default {
    mixins: [ Page ],
    components: {
      SiteUpdateModal,
      SiteReasonAddModal
    },
    data () {
      return {
        meta: {
          title: 'Site Ready Checklist'
        },
        sites: [],
      }
    },
    methods: {
      init () {
        this.initTable()
        this.list()
      },
      list () {
        this.$root.req('Sites:list', this.filters).then(response => {
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
          columns: SitesColumns,
          paging: false,
          dom: 'Bt',
          buttons: [ 'colvis' ]
        }

        this.table = $(this.$refs.table).DataTable(config)
        if (this.sites) {
          var rows = $.extend(true, [], this.sites)
          this.table.rows.add(rows)
          this.table.draw()
        }

        $(this.$refs.table).on('click', 'a[href="#site_ready"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.SiteUpdateModal.open({data, row})
        })

      },
    },
  }
</script>
