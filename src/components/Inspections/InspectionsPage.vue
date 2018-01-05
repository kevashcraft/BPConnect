<template>
  <div>
    <div class="page-container">
      <table ref="table" class="ui celled table" width="100%"></table>
    </div>
    <inspection-fail-modal ref="InspectionFailModal" @update="list"></inspection-fail-modal>
    <inspection-pass-modal ref="InspectionPassModal" @update="list"></inspection-pass-modal>
    <inspection-schedule-modal ref="InspectionScheduleModal" @update="list"></inspection-schedule-modal>
  </div>
</template>

<script>
  import Page from '../Page/Page'
  import InspectionsColumns from './InspectionsColumns'
  import InspectionPassModal from './InspectionPassModal.vue'
  import InspectionScheduleModal from './InspectionScheduleModal.vue'
  import InspectionFailModal from './InspectionFailModal.vue'

  export default {
    mixins: [ Page ],
    components: {
      InspectionFailModal,
      InspectionPassModal,
      InspectionScheduleModal,
    },
    data () {
      return {
        meta: {
          name: 'InspectionsPage',
          title: 'Inspections',
          list: 'Inspections:list',
          columns: InspectionsColumns
        }
      }
    },
    methods: {
      initTableListeners () {
        $(this.$refs.table).on('click', 'a[href="#schedule_inspection"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.InspectionScheduleModal.open(data)
        })
        $(this.$refs.table).on('click', 'a[href="#pass_inspection"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.InspectionPassModal.open(data)
        })
        $(this.$refs.table).on('click', 'a[href="#fail_inspection"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.InspectionFailModal.open(data)
        })
      },
    }
  }
</script>
