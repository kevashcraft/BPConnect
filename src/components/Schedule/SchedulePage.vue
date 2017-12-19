<template>
  <div>
    <div id="schedule" class="page-container">
      <div id="schedule_table_container">
        <table id="schedule_table" class="ui celled table"></table>
      </div>
    </div>
    <schedule-update-workers-modal></schedule-update-workers-modal>
    <schedule-update-schedule-modal></schedule-update-schedule-modal>
    <schedule-sendout-ticket-modal></schedule-sendout-ticket-modal>
  </div>
</template>

<script>
  import ScheduleUpdateWorkersModal from './ScheduleUpdateWorkersModal.vue'
  import ScheduleUpdateScheduleModal from './ScheduleUpdateScheduleModal.vue'
  import ScheduleSendoutTicketModal from './ScheduleSendoutTicketModal.vue'

  export default {
    data () {
      return {}
    },
    components: {
      ScheduleUpdateWorkersModal,
      ScheduleUpdateScheduleModal,
      ScheduleSendoutTicketModal
    },
    data () {
      return {}
    },
    watch: {
    },
    mounted: function() {

      BPC.active = this;
      this.controls = BPC.schedule_controls;
      this.init();

      if (BPC.isLocalStorageAvailable) {
        var daterange = localStorage.getItem('daterange');
        if (daterange) {
          daterange = JSON.parse(daterange);
          this.controls.daterange = daterange;
          this.update();
          return;
        }
      }

      setTimeout(function() {
        $('.daterangepicker').click();
      }, 1500);
    },
    methods: {
      init: function () {
        this.init_table();
      },
      update: function() {
        this.schedule_table.clear();
        this.schedule_table.draw();
        BPC.site_loading();
        var data = {
          daterange : BPC.schedule_controls.daterange,
          filters   : BPC.schedule_controls.filtersValues(),
        }
        var url = BPC.r.schedule.list;

        $.post(url, data, function (data) {
          setTimeout(function () {
            BPC.site_loading(false);
          }.bind(this), 150);
          this.schedule = data.schedule;
          this.schedule_table.rows.add(data.schedule);
          this.schedule_table.draw();
        }.bind(this), "json");

        $('.daterangepicker').data('daterangepicker').setStartDate(
          moment(this.controls.daterange[0])
        );
        $('.daterangepicker').data('daterangepicker').setEndDate(
          moment(this.controls.daterange[1])
        );

      },
      reload_table: function() {
        this.schedule_table.destroy();
        $('#schedule_table').remove();

        var container = $('#schedule_table_container');
        container.append('<table id="schedule_table" class="ui celled table"></table>');

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

        this.schedule_table = $('#schedule_table').DataTable(config);
        if (this.schedule) {
          var rows = $.extend(true, [], this.schedule);
          this.schedule_table.rows.add(rows);
          this.schedule_table.draw();
        }

        $('#schedule_table').on('click', 'a[href="#update_workers"]', function(event) {
          var row = $(this).closest('tr');
          var table = BPC.schedule.schedule_table;
          var data = table.row(row).data();
          BPC.schedule.schedule_update_workers_modal.open(data, row);
        });

        $('#schedule_table').on('click', 'a[href="#update_schedule"]', function(event) {
          var row = $(this).closest('tr');
          var table = BPC.schedule.schedule_table;
          var data = table.row(row).data();
          BPC.schedule.schedule_update_schedule_modal.open(data, row);
        });

        $('#schedule_table').on('click', 'a[href="#sendout_ticket"]', function(event) {
          var row = $(this).closest('tr');
          var table = BPC.schedule.schedule_table;
          var data = table.row(row).data();
          BPC.schedule.schedule_sendout_ticket_modal.open(data, row);
        });

      },
    },
  }
</script>
