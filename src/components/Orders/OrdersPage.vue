<template>
  <div>
    <table ref="table" class="ui celled responsive table"></table>
    <order-parts-modal ref="OrderPartsModal" @update="list"></order-parts-modal>
    <order-parts-received-modal ref="OrderPartsReceivedModal" @update="list"></order-parts-received-modal>
    <order-supplier-add-modal ref="OrderSupplierAddModal"></order-supplier-add-modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Page from '../Page/Page'
  import OrderColumns from './OrderColumns'

  import OrderPartsModal from './OrderPartsModal.vue'
  import OrderPartsReceivedModal from './OrderPartsReceivedModal.vue'
  import OrderSupplierAddModal from './OrderSupplierAddModal.vue'

  export default {
    mixins: [ Page ],
    components: {
      OrderPartsModal,
      OrderPartsReceivedModal,
      OrderSupplierAddModal
    },
    data () {
      return {
        meta: {
          title: 'Orders'
        },
        orders: [],
      }
    },

    methods: {
      init () {
        this.initTable()
        this.list()
      },
      list () {
        this.$root.req('Orders:list', this.filters).then(response => {
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
          columns: OrderColumns,
          paging: false,
          dom: 'Bt',
          buttons: [ 'colvis' ]
        }

        this.table = $(this.$refs.table).DataTable(config)
        if (this.orders) {
          var rows = $.extend(true, [], this.orders)
          this.table.rows.add(rows)
          this.table.draw()
        }

        $(this.$refs.table).on('click', 'a[href="#order_parts"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.OrderPartsModal.open({row, data})
        })

        $(this.$refs.table).on('click', 'a[href="#parts_received"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          console.log('data', data)
          this.$refs.OrderPartsReceivedModal.open({row, data})
        })
      },

      updateRow (row) {
        var data = this.table.row(row).data()
        this.$root.req('Orders:retrieve', { id: data.orderId }).then(response => {
          this.table.row(row).data(response)
        })
      },
    },
  }
</script>
