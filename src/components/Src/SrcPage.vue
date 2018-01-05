<template>
  <div>
    <div class="page-container">
      <table ref="table" class="ui celled table" width="100%"></table>
    </div>
    <src-update-modal ref="SrcUpdateModal" @update="list"></src-update-modal>
    <src-reason-add-modal ref="SrcReasonAddModal"></src-reason-add-modal>
  </div>
</template>

<script>
  import Page from '../Page/Page'
  import SrcColumns from './SrcColumns'
  import SrcUpdateModal from './SrcUpdateModal.vue'
  import SrcReasonAddModal from './SrcReasonAddModal.vue'

  export default {
    mixins: [ Page ],
    components: {
      SrcUpdateModal,
      SrcReasonAddModal
    },
    data () {
      return {
        meta: {
          name: 'SrcPage',
          title: 'Site Ready Checklist',
          list: 'Src:list',
          columns: SrcColumns
        },
      }
    },
    methods: {
      initTableListeners () {
        $(this.$refs.table).on('click', 'a[href="#site_ready"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.SrcUpdateModal.open({data, row})
        })
      },
    },
  }
</script>
