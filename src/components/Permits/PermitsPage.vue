<template>
  <div>
    <div class="page-container">
      <table ref="table" class="ui celled table" width="100%"></table>
    </div>
    <permit-add-modal ref="PermitAddModal" @update="list"></permit-add-modal>
  </div>
</template>

<script>
  import Page from '../Page/Page'
  import PermitsColumns from './PermitsColumns'
  import PermitAddModal from './PermitAddModal.vue'

  export default {
    mixins: [ Page ],
    components: {
      PermitAddModal
    },
    data () {
      return {
        meta: {
          name: 'PermitsPage',
          title: 'Permits',
          list: 'Permits:list',
          columns: PermitsColumns
        }
      }
    },
    methods: {
      initTableListeners () {
        $(this.$refs.table).on('click', 'a[href="#permit_add"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.PermitAddModal.open({data, row})
        })
      },
    },
  }
</script>
