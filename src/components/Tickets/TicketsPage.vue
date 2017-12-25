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

  import html2canvas from 'html2canvas'

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
          buttons: [ { extend: 'colvis', text: 'Visible Columns', className: 'ui button' } ]
        }

        this.table = $(this.$refs.table).DataTable(config)
        if (this.tickets) {
          var rows = $.extend(true, [], this.tickets)
          this.table.rows.add(rows)
          this.table.draw()
        }

        this.table.buttons().containers()
                    .appendTo($('.TicketColumnsButton'))

        // $('.TicketColumnsButton').empty()
        // var canvas = document.createElement('canvas')
        // canvas.width = '1200px'
        // canvas.height = '800px'

        $('.TicketColumnsButton .dt-buttons.ui.basic').removeClass('basic').on('click',() => {
            $('.TicketColumnsButton .dt-button-collection.vertical').removeClass('vertical').removeClass('basic').addClass('horizontal').css('width', '80vw').css('overflow-x', 'auto')
        })

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
