<template>
  <div>
    <div id="sites" class="page-container">
      <div id="sites_table_container">
        <table id="sites_table" class="ui celled table"></table>
      </div>
    </div>
    <site-update-modal></site-update-modal>
    <site-reason-add-modal></site-reason-add-modal>
  </div>
</template>

<script>
  import SiteUpdateModal from './SiteUpdateModal.vue'
  import SiteReasonAddModal from './SiteReasonAddModal.vue'

  export default {
    components: {
      SiteUpdateModal,
      SiteReasonAddModal
    },
    data: {
    },
    watch: {
    },
    ready: function() {

      BPC.active = this;
      this.controls = BPC.sites_controls;
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
        this.sites_table.clear();
        this.sites_table.draw();
        BPC.site_loading();
        var data = {
          daterange: this.controls.daterange,
          filters  : this.controls.filters,
        };
        $.post(BPC.r.sites.list, data, function (data) {
          setTimeout(function () {
            BPC.site_loading(false);
          }, 150);
          this.sites = data.sites;
          this.sites_table.rows.add(data.sites);
          this.sites_table.draw();
        }.bind(this), "json");

        $('.daterangepicker').data('daterangepicker').setStartDate(
          moment(this.controls.daterange[0])
        );
        $('.daterangepicker').data('daterangepicker').setEndDate(
          moment(this.controls.daterange[1])
        );

      },
      reload_table: function() {
        this.sites_table.destroy();
        $('#sites_table').remove();

        var container = $('#sites_table_container');
        container.append('<table id="sites_table" class="ui celled table"></table>');

        this.init_table();
      },

      init_table: function () {
        var columns = $.extend(true, [], BPC.i.columns);

        var config = {
          columns: columns,
          paging: false,
          dom: 't'
        };

        this.sites_table = $('#sites_table').DataTable(config);
        if (this.site) {
          var rows = $.extend(true, [], this.site);
          this.sites_table.rows.add(rows);
          this.sites_table.draw();
        }

        $('#sites_table').on('click', 'a[href="#site_ready"]', function(event) {
          var row = $(this).closest('tr');
          var table = BPC.sites.sites_table;
          var data = table.row(row).data();
          BPC.sites.site_update_modal.open(data, row);
        });

      },
    },
  }
</script>
