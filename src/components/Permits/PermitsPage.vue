<template>
  <div>
    <div id="permits" class="page-container">
      <div id="permits_table_container">
        <table id="permits_table" class="ui celled table"></table>
      </div>
    </div>
    <permit-add-modal></permit-add-modal>
  </div>
</template>

<script>
  import PermitAddModal from './PermitAddModal.vue'

  export default {
    components: {
      PermitAddModal
    },
    data () {
      return {}
    },
    watch: {
    },
    mounted: function() {

      BPC.active    = this;
      this.controls = BPC.permits_controls;

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
        this.permits_table.clear();
        this.permits_table.draw();
        BPC.site_loading();
        var data = {
          daterange: this.controls.daterange,
          filters  : this.controls.filters,
        };
        $.post(BPC.r.permits.list, data, function (data) {
          setTimeout(function () {
            BPC.site_loading(false);
          }, 150);
          this.permits = data.permits;
          this.permits_table.rows.add(data.permits);
          this.permits_table.draw();
        }.bind(this), "json");

        $('.daterangepicker').data('daterangepicker').setStartDate(
          moment(this.controls.daterange[0])
        );
        $('.daterangepicker').data('daterangepicker').setEndDate(
          moment(this.controls.daterange[1])
        );
      },
      reload_table: function() {
        this.permits_table.destroy();
        $('#permits_table').remove();

        var container = $('#permits_table_container');
        container.append('<table id="permits_table" class="ui celled table"></table>');

        this.init_table();
      },

      init_table: function () {
        var columns = $.extend(true, [], BPC.i.columns);

        var config = {
          columns: columns,
          paging: false,
          dom: 't'
        };

        this.permits_table = $('#permits_table').DataTable(config);
        if (this.permits) {
          var rows = $.extend(true, [], this.permits);
          this.permits_table.rows.add(rows);
          this.permits_table.draw();
        }

        $('#permits_table').on('click', 'a[href="#permit_add"]', function(event) {
          var row = $(this).closest('tr');
          var table = BPC.permits.permits_table;
          var data = table.row(row).data();
          BPC.permits.permit_add_modal.open(data, row);
        });
      },
    },

  }
</script>
