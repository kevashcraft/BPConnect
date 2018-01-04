<template>
  <div>
    <div class="page-container">
      <table ref="table" class="ui celled table"></table>
    </div>
    <ticket-add-modal ref="TicketAddModal" @update="list"></ticket-add-modal>
    <ticket-import-data-modal ref="TicketImportDataModal" @update="list"></ticket-import-data-modal>
    <ticket-tasks-modal ref="TicketTasksModal" @update="list"></ticket-tasks-modal>
    <ticket-work-modal ref="TicketWorkModal"></ticket-work-modal>
  </div>
</template>

<script>
  import Page from '../Page/Page'
  import TicketColumns from './TicketColumns'

  import TicketAddModal from './TicketAddModal.vue'
  import TicketImportDataModal from './TicketImportDataModal.vue'
  import TicketTasksModal from './TicketTasksModal.vue'
  import TicketWorkModal from './TicketWorkModal.vue'

  import html2canvas from 'html2canvas'

  export default {
    components: {
      TicketAddModal,
      TicketImportDataModal,
      TicketTasksModal,
      TicketWorkModal,
    },
    data () {
      return {
        meta: {
          name: 'TicketsPage',
          title: 'Tickets'
        },
        tickets: [],
      }
    },
    mixins: [ Page ],
    methods: {
      init () {
        this.initTable()
        this.list()
      },
      list () {
        this.$root.req('Tickets:list', this.filters).then(response => {
          this.table.clear()
          this.table.rows.add(response)
          this.table.draw()
        })
      },
      ticketHide () {
        $('#ticket').removeClass('show')
      },

      initTable () {
        var config = {
          stateSave: true,
          colReorder: true,
          responsive: true,
          columns: TicketColumns,
          paging: false,
          dom: 'Bt',
          buttons: [ { extend: 'colvis', text: 'Visible Columns', className: 'ui button' } ]
        }

        this.table = $(this.$refs.table).DataTable(config)
        if (this.tickets) {
          var rows = $.extend(true, [], this.tickets)
          this.table.rows.add(rows)
          this.table.draw()
        }

        this.moveColumnsButton('TicketColumnsButton')

        $(this.$refs.table).on('click', 'a[href="#import_data"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.TicketImportDataModal.open({row, data})
        })
        $(this.$refs.table).on('click', 'a[href="#ticket_work"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.TicketWorkModal.open({row, data})
        })
        $(this.$refs.table).on('click', 'a[href="#tasks"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.TicketTasksModal.open(data)
        })
        $(this.$refs.table).on('click', 'a[href="#print"]', (event) => {
          this.$root.noty('Creating PDF..')
          let row = $(event.currentTarget).closest('tr')
          let data = this.table.row(row).data()
          let req = { ticketId: data.ticketId }
          this.$root.req('TicketPdf:create', req).then(response => {
            window.open(response, '_blank')
          })

        })
      },
      // reloadTable () {
      //   this.ticketsTable.destroy()
      //   $('#ticketsTable').remove()

      //   var container = $('#ticketsTableContainer')
      //   container.append('<table id="ticketsTable" class="ui celled responsive table"></table>')

      //   this.initTable()
      // },
    },
  }
</script>
