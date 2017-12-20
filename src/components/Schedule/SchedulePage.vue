<template>
  <div>
    <table ref="table" class="ui celled responsive table"></table>
    <schedule-update-workers-modal ref="ScheduleUpdateWorkersModal"></schedule-update-workers-modal>
    <schedule-update-schedule-modal ref="ScheduleUpdateScheduleModal"></schedule-update-schedule-modal>
    <schedule-sendout-ticket-modal ref="ScheduleSendoutTicketModal"></schedule-sendout-ticket-modal>
  </div>
</template>

<script>
  import Page from '../Page/Page'
  import ScheduleColumns from './ScheduleColumns'

  import ScheduleUpdateWorkersModal from './ScheduleUpdateWorkersModal.vue'
  import ScheduleUpdateScheduleModal from './ScheduleUpdateScheduleModal.vue'
  import ScheduleSendoutTicketModal from './ScheduleSendoutTicketModal.vue'

  export default {
    mixins: [ Page ],
    data () {
      return {
        meta: {
          name: 'SchedulePage',
          title: 'Schedule'
        }
      }
    },
    components: {
      ScheduleUpdateWorkersModal,
      ScheduleUpdateScheduleModal,
      ScheduleSendoutTicketModal
    },
    methods: {
      init () {
        this.initTable()
        this.list()
      },
      list () {
        this.$root.req('Schedule:list', this.filters).then(response => {
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
          columns: ScheduleColumns,
          paging: false,
          dom: 'Bt',
          buttons: [ 'colvis' ]
        }

        this.table = $(this.$refs.table).DataTable(config)
        if (this.schedule) {
          var rows = $.extend(true, [], this.schedule)
          this.table.rows.add(rows)
          this.table.draw()
        }

        $(this.$refs.table).on('click', 'a[href="#update_workers"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.ScheduleUpdateWorkersModal.open({data, row})
        })

        $(this.$refs.table).on('click', 'a[href="#update_schedule"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.ScheduleUpdateScheduleModal.open({data, row})
        })

        $(this.$refs.table).on('click', 'a[href="#sendout_ticket"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.ScheduleSendoutTicketModal.open({data, row})
        })

      },
    },
  }
</script>
