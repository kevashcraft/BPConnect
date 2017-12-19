<template>
  <div>
    <div id="orders" class="page-container">
      <div id="orders_table_container">
        <table id="orders_table" class="ui celled table"></table>
      </div>
    </div>
    <order-parts-modal></order-parts-modal>
    <order-parts-received-modal></order-parts-received-modal>
    <order-supplier-add-modal></order-supplier-add-modal>
  </div>
</template>

<script>
  import OrderPartsModal from './OrderPartsModal.vue'
  import OrderPartsReceivedModal from './OrderPartsReceivedModal.vue'
  import OrderSupplierAddModal from './OrderSupplierAddModal.vue'

  export default {
    components: {
      OrderPartsModal,
      OrderPartsReceivedModal,
      OrderSupplierAddModal
    },
    data() {
      return {}
    },
    watch: {
    },
    mounted: function() {

      BPC.active = this;
      this.controls = BPC.orders_controls;
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
      }, 750);

    },

    methods: {
      init: function () {
        this.init_table();
      },
      update: function() {
        this.orders_table.clear();
        this.orders_table.draw();
        BPC.site_loading();
        var data = {
          daterange : BPC.orders_controls.daterange,
          filters   : BPC.orders_controls.filtersValues(),
        }
        var url = BPC.routes['orders.list'];

        $.post(url, data, function (data) {
          setTimeout(function () {
            BPC.site_loading(false);
          }.bind(this), 150);
          this.orders = data.orders;
          this.orders_table.rows.add(data.orders);
          this.orders_table.draw();
        }.bind(this), "json");


        $('.daterangepicker').data('daterangepicker').setStartDate(
          moment(this.controls.daterange[0])
        );
        $('.daterangepicker').data('daterangepicker').setEndDate(
          moment(this.controls.daterange[1])
        );

      },
      reload_table: function() {
        this.orders_table.destroy();
        $('#orders_table').remove();

        var container = $('#orders_table_container');
        container.append('<table id="orders_table" class="ui celled table"></table>');

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

        this.orders_table = $('#orders_table').DataTable(config);
        if (this.orders) {
          var rows = $.extend(true, [], this.orders);
          this.orders_table.rows.add(rows);
          this.orders_table.draw();
        }

        $('#orders_table').on('click', 'a[href="#order_parts"]', function(event) {
          var row = $(this).closest('tr');
          var table = BPC.orders.orders_table;
          var data = table.row(row).data();
          BPC.orders.order_parts_modal.open(data, row);
        });
        $('#orders_table').on('click', 'a[href="#parts_received"]', function(event) {
          var row = $(this).closest('tr');
          var table = BPC.orders.orders_table;
          var data = table.row(row).data();
          BPC.orders.parts_received_modal.open(data, row);
        });
      },
    },
  }
</script>
