<template>
  <div>
    <div class="page-container">
      <table ref="table" class="ui celled table"></table>
    </div>
    <inspection-fail-modal ref="InspectionFailModal"></inspection-fail-modal>
    <inspection-pass-modal ref="InspectionPassModal"></inspection-pass-modal>
    <inspection-schedule-modal ref="InspectionScheduleModal"></inspection-schedule-modal>
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
          title: 'Inspections'
        }
      }
    },
    mounted () {
      // this.init()

      // if (BPC.isLocalStorageAvailable) {
      //   var daterange = localStorage.getItem('daterange')
      //   if (daterange) {
      //     daterange = JSON.parse(daterange)
      //     this.controls.daterange = daterange
      //     this.update()
      //     return
      //   }
      // }

      // setTimeout(function() {
      //   $('.daterangepicker').click()
      // }, 1500)
    },
    methods: {
      init: function () {
        this.initTable()
        this.list()
      },
      list () {
        this.$root.req('Inspections:list', this.filters).then(response => {
          this.table.clear()
          this.table.rows.add(response)
          this.table.draw()
        })
      },

      initTable: function () {
        var config = {
          stateSave: true,
          colReorder: true,
          responsive: true,
          columns: InspectionsColumns,
          paging: false,
          dom: 'Bt',
          buttons: [ 'colvis' ]
        }

        this.table = $(this.$refs.table).DataTable(config)
        if (this.inspections) {
          var rows = $.extend(true, [], this.inspections)
          this.table.rows.add(rows)
          this.table.draw()
        }

        $(this.$refs.table).on('click', 'a[href="#schedule_inspection"]', function(event) {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.InspectionScheduleModal.open({row, data})
        })
        $(this.$refs.table).on('click', 'a[href="#pass_inspection"]', function(event) {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.InspectionPassModal.open({ref, data})
        })
        $(this.$refs.table).on('click', 'a[href="#fail_inspection"]', function(event) {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.InspectionFailModal.open({ref, data})
        })
      },
    }
  }
</script>