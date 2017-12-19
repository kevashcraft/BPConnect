<template>
  <div>
    <table id="ticketsTable" class="ui celled responsive table" cellspacing="0" width="100%"></table>
    <ticket-import-data-modal ref="import"></ticket-import-data-modal>
    <ticket-work-modal ref="work"></ticket-work-modal>
    <ticket-add-modal ref="add"></ticket-add-modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import TicketAddModal from './TicketAddModal.vue'
  import TicketImportDataModal from './TicketImportDataModal.vue'
  import TicketWorkModal from './TicketWorkModal.vue'
  import columns from '../../site/defs/columns'
  import Page from '../Misc/Page'

  export default {
    components: {
      TicketAddModal,
      TicketImportDataModal,
      TicketWorkModal
    },
    computed: mapState([ 'filters' ]),
    data () {
      return {
        meta: {
          title: 'Tickets'
        },
        tickets: [],
      }
    },
    watch: {
      filters: {
        handler () {
          console.log("updated!!!!", this.filters.daterange);
          this.update()
        },
        deep: true
      }
    },
    mixins: [ Page ],
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.init_table()
        this.update()
      },
      update () {
        this.$root.req('Tickets:list', this.filters).then(response => {
          this.ticketsTable.clear()
          this.ticketsTable.rows.add(response)
          this.ticketsTable.draw()
        })
      },
      ticketHide () {
        $('#ticket').removeClass('show')
      },

      init_table () {
        // var columns = $.extend(true, [], BPC.i.columns)

        var config = {
          stateSave: true,
          colReorder: true,
          responsive: true,
          columns: columns,
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

        // $('#ticketsTable').on('click', '.ticket_id', function(event) {
        //   var row = $(this).closest('tr')
        //   var table = BPC.tickets.ticketsTable
        //   var data = table.row(row).data()
        //   BPC.ticket.open(data)
        // })
        $('#ticketsTable').on('click', 'a[href="#import_data"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var table = this.ticketsTable
          console.log("row",row);
          var ticket = table.row(row).data()
          console.log("ticket",ticket);
          this.$refs.import.open(ticket)
        })
        $('#ticketsTable').on('click', 'a[href="#ticket_work"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.ticketsTable.row(row).data()
          this.$refs.work.open(data.ticket_id)
        })
      },
      // reload_table () {
      //   this.ticketsTable.destroy()
      //   $('#ticketsTable').remove()

      //   var container = $('#ticketsTableContainer')
      //   container.append('<table id="ticketsTable" class="ui celled responsive table"></table>')

      //   this.init_table()
      // },
    },
  }
</script>
