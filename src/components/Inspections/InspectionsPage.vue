<template>
  <div>
    <div id="inspections" class="page-container">
      <div id="inspections_table_container">
        <table id="inspections_table" class="ui celled table"></table>
      </div>
    </div>
    <inspection-fail-modal></inspection-fail-modal>
    <inspection-pass-modal></inspection-pass-modal>
    <inspection-schedule-modal></inspection-schedule-modal>
  </div>
</template>

<script>
  import InspectionPassModal from './InspectionPassModal.vue'
  import InspectionScheduleModal from './InspectionScheduleModal.vue'
  import InspectionFailModal from './InspectionFailModal.vue'

  export default {
    components: {
      InspectionFailModal,
      InspectionPassModal,
      InspectionScheduleModal,
    },
    data () {
      return {}
    },
    watch: {
    },
    mounted: function() {
      // this.init();

      // if (BPC.isLocalStorageAvailable) {
      //   var daterange = localStorage.getItem('daterange');
      //   if (daterange) {
      //     daterange = JSON.parse(daterange);
      //     this.controls.daterange = daterange;
      //     this.update();
      //     return;
      //   }
      // }

      // setTimeout(function() {
      //   $('.daterangepicker').click();
      // }, 1500);
    },
    methods: {
      init: function () {
        this.init_table();
      },
      update: function() {
        this.inspections_table.clear();
        this.inspections_table.draw();
        BPC.site_loading();
        var data = {
          daterange : BPC.inspections_controls.daterange,
          filters   : BPC.inspections_controls.filtersValues(),
        }
        var url = BPC.routes['inspections.list'];

        $.post(url, data, function (data) {
          setTimeout(function () {
            BPC.site_loading(false);
          }.bind(this), 150);
          this.inspections = data.inspections;
          this.inspections_table.rows.add(data.inspections);
          this.inspections_table.draw();
        }.bind(this), "json");

      },
      reload_table: function() {
        this.inspections_table.destroy();
        $('#inspections_table').remove();

        var container = $('#inspections_table_container');
        container.append('<table id="inspections_table" class="ui celled table"></table>');

        this.init_table();
      },

      init_table: function () {
        var columns = $.extend(true, [], BPC.i.columns);

        var config = {
          responsive: true,
          columns: columns,
          paging: false,
          dom: 't'
        };

        this.inspections_table = $('#inspections_table').DataTable(config);
        if (this.inspections) {
          var rows = $.extend(true, [], this.inspections);
          this.inspections_table.rows.add(rows);
          this.inspections_table.draw();
        }

        $('#inspections_table').on('click', 'a[href="#schedule_inspection"]', function(event) {
          var row = $(this).closest('tr');
          var table = BPC.inspections.inspections_table;
          var data = table.row(row).data();
          BPC.inspections.schedule_inspection_modal.open(data, row);
        });
        $('#inspections_table').on('click', 'a[href="#pass_inspection"]', function(event) {
          var row = $(this).closest('tr');
          var table = BPC.inspections.inspections_table;
          var data = table.row(row).data();
          BPC.inspections.pass_inspection_modal.open(data, row);
        });
        $('#inspections_table').on('click', 'a[href="#fail_inspection"]', function(event) {
          var row = $(this).closest('tr');
          var table = BPC.inspections.inspections_table;
          var data = table.row(row).data();
          BPC.inspections.fail_inspection_modal.open(data, row);
        });
      },
    }
  }
</script>