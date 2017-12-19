<template>
  <div>
    <div id="wip" class="page-container">
      <div id="wip_table_container">
        <table id="wip_table" class="ui celled table"></table>
      </div>
    </div>
    <wip-checkin-modal></wip-checkin-modal>
    <wip-start-modal></wip-start-modal>
    <wip-walk-modal></wip-walk-modal>
  </div>
</template>

<script>
  import WipCheckinModal from './WipCheckinModal.vue'
  import WipStartModal from './WipStartModal.vue'
  import WipWalkModal from './WipWalkModal.vue'

  export default {
    components: {
      WipCheckinModal,
      WipStartModal,
      WipWalkModal
    },
    data () {
      return {}
    },
    watch: {
    },
    mounted: function() {

      BPC.active    = this;
      this.controls = BPC.wip_controls;

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
        this.wip_table.clear();
        this.wip_table.draw();
        BPC.site_loading();
        var data = {
          daterange: this.controls.daterange,
          filters  : this.controls.filters,
        };
        $.post(BPC.routes['wip.list'], data, function (data) {
          setTimeout(function () {
            BPC.site_loading(false);
          }, 150);
          this.wip = data.wip;
          this.wip_table.rows.add(data.wip);
          this.wip_table.draw();
        }.bind(this), "json");

        $('.daterangepicker').data('daterangepicker').setStartDate(
          moment(this.controls.daterange[0])
        );
        $('.daterangepicker').data('daterangepicker').setEndDate(
          moment(this.controls.daterange[1])
        );
      },
      reload_table: function() {
        this.wip_table.destroy();
        $('#wip_table').remove();

        var container = $('#wip_table_container');
        container.append('<table id="wip_table" class="ui celled table"></table>');

        this.init_table();
      },

      init_table: function () {
        var columns = $.extend(true, [], BPC.i.columns);

        var config = {
          columns: columns,
          paging: false,
          dom: 't'
        };

        this.wip_table = $('#wip_table').DataTable(config);
        if (this.wip) {
          var rows = $.extend(true, [], this.wip);
          this.wip_table.rows.add(rows);
          this.wip_table.draw();
        }

        $('#wip_table').on('click', 'a[href="#start_work"]', function(event) {
          var row = $(this).closest('tr');
          var table = BPC.wip.wip_table;
          var data = table.row(row).data();
          BPC.wip.wip_start_modal.open(data);
        });

        $('#wip_table').on('click', 'a[href="#checkin_work"]', function(event) {
          var row = $(this).closest('tr');
          var table = BPC.wip.wip_table;
          var data = table.row(row).data();
          BPC.wip.wip_checkin_modal.open(data);
        });

        $('#wip_table').on('click', 'a[href="#walk_ticket"]', function(event) {
          var row = $(this).closest('tr');
          var table = BPC.wip.wip_table;
          var data = table.row(row).data();
          BPC.wip.wip_walk_modal.open(data);
        });
      },
    },
  }
</script>
