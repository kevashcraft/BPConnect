<template>
  <div>
    <div class="page-container">
      <table ref="table" class="ui celled table" width="100%"></table>
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
          title: 'Tickets',
          list: 'Tickets:list',
          columns: TicketColumns
        },
      }
    },
    mixins: [ Page ],
    methods: {
      initTableListeners () {
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
          if (row.hasClass('child')) {
            row = row.prev('.parent')
          }
          let data = this.table.row(row).data()
          let req = { ticketId: data.ticketId }
          this.$root.req('TicketPdf:create', req).then(response => {
            window.open(response, '_blank')
          })
        })
      },
    },
  }
</script>
