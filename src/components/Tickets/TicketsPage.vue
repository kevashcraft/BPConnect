<template>
  <div>
    <table ref="table" class="ui celled responsive table"></table>
    <ticket-import-data-modal ref="TicketImportDataModal"></ticket-import-data-modal>
    <ticket-work-modal ref="TicketWorkModal"></ticket-work-modal>
    <ticket-add-modal ref="TicketAddModal" @update="list"></ticket-add-modal>
  </div>
</template>

<script>
  import Page from '../Page/Page'
  import TicketColumns from './TicketColumns'

  import TicketAddModal from './TicketAddModal.vue'
  import TicketImportDataModal from './TicketImportDataModal.vue'
  import TicketWorkModal from './TicketWorkModal.vue'

  export default {
    components: {
      TicketAddModal,
      TicketImportDataModal,
      TicketWorkModal
    },
    data () {
      return {
        meta: {
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
        // var columns = $.extend(true, [], BPC.i.columns)

        var config = {
          stateSave: true,
          colReorder: true,
          responsive: true,
          columns: TicketColumns,
          paging: false,
          dom: 'Bt',
          buttons: [ 'colvis' ]
        }

        this.table = $(this.$refs.table).DataTable(config)
        if (this.tickets) {
          var rows = $.extend(true, [], this.tickets)
          this.table.rows.add(rows)
          this.table.draw()
        }

        // $('#ticketsTable').on('click', '.ticketId', function(event) {
        //   var row = $(this).closest('tr')
        //   var table = BPC.tickets.ticketsTable
        //   var data = table.row(row).data()
        //   BPC.ticket.open(data)
        // })
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
