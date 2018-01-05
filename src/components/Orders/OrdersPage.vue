<template>
  <div>
    <div class="page-container">
      <table ref="table" class="ui celled table" width="100%"></table>
    </div>
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
          name: 'OrdersPage',
          title: 'Orders',
          list: 'Orders:list',
          columns: OrderColumns
        },
      }
    },
    methods: {
      initTableListeners () {
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
    },
  }
</script>
