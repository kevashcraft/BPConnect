<template>
  <div>
    <div class="page-container">
      <table ref="table" class="ui celled table" width="100%"></table>
    </div>
    <wip-checkin-modal ref="WipCheckinModal" @update="list"></wip-checkin-modal>
    <wip-start-modal ref="WipStartModal" @update="list"></wip-start-modal>
    <wip-walk-modal ref="WipWalkModal" @update="list"></wip-walk-modal>
  </div>
</template>

<script>
  import Page from '../Page/Page'
  import WipColumns from './WipColumns'

  import WipCheckinModal from './WipCheckinModal.vue'
  import WipStartModal from './WipStartModal.vue'
  import WipWalkModal from './WipWalkModal.vue'

  export default {
    mixins: [ Page ],
    components: {
      WipCheckinModal,
      WipStartModal,
      WipWalkModal
    },
    data () {
      return {
        meta: {
          name: 'WipPage',
          title: 'Work in Progress',
          list: 'Wip:list',
          columns: WipColumns
        }
      }
    },
    methods: {
      initTableListeners () {
        $(this.$refs.table).on('click', 'a[href="#start_work"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.WipStartModal.open(data)
        })

        $(this.$refs.table).on('click', 'a[href="#checkin_work"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.WipCheckinModal.open(data)
        })

        $(this.$refs.table).on('click', 'a[href="#walk_ticket"]', (event) => {
          var row = $(event.currentTarget).closest('tr')
          var data = this.table.row(row).data()
          this.$refs.WipWalkModal.open(data)
        })
      },
    },
  }
</script>
