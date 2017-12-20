<template>
  <div>
    <table id="ticketsTable" class="ui celled responsive table" cellspacing="0" width="100%"></table>
    <ticket-import-data-modal ref="import"></ticket-import-data-modal>
    <ticket-work-modal ref="work"></ticket-work-modal>
    <ticket-add-modal ref="add"></ticket-add-modal>
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
          this.ticketsTable.clear()
          this.ticketsTable.rows.add(response)
          this.ticketsTable.draw()
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

        this.ticketsTable = $('#ticketsTable').DataTable(config)
        if (this.tickets) {
          var rows = $.extend(true, [], this.tickets)
          this.ticketsTable.rows.add(rows)
          this.ticketsTable.draw()
        }

        // $('#ticketsTable').on('click', '.ticketId', function(event) {
        //   var row = $(this).closest('tr')
        //   var table = BPC.tickets.ticketsTable
        //   var data = table.row(row).data()
        //   BPC.ticket.open(data)
        // })
        $('#ticketsTable').on('click', 'a[href="#importData"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var table = this.ticketsTable
          var ticket = table.row(row).data()
          this.$refs.import.open(ticket)
        })
        $('#ticketsTable').on('click', 'a[href="#ticketWork"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.ticketsTable.row(row).data()
          this.$refs.work.open(data.ticketId)
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
