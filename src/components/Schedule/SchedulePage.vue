<template>
  <div>
    <div class="page-container">
      <table ref="table" class="ui celled table"></table>
    </div>
    <schedule-update-workers-modal ref="ScheduleUpdateWorkersModal" @update="list"></schedule-update-workers-modal>
    <schedule-update-schedule-modal ref="ScheduleUpdateScheduleModal" @update="list"></schedule-update-schedule-modal>
    <schedule-sendout-ticket-modal ref="ScheduleSendoutTicketModal" @update="list"></schedule-sendout-ticket-modal>
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
          title: 'Schedule',
          list: 'Schedule:list',
          columns: ScheduleColumns
        }
      }
    },
    components: {
      ScheduleUpdateWorkersModal,
      ScheduleUpdateScheduleModal,
      ScheduleSendoutTicketModal
    },
    methods: {
      initTableListeners () {
        $(this.$refs.table).on('click', 'a[href="#update_workers"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.ScheduleUpdateWorkersModal.open(data)
        })

        $(this.$refs.table).on('click', 'a[href="#update_schedule"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.ScheduleUpdateScheduleModal.open(data)
        })

        $(this.$refs.table).on('click', 'a[href="#sendout_ticket"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.ScheduleSendoutTicketModal.open(data)
        })
      },
    },
  }
</script>
