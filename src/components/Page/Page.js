import { mapState } from 'vuex'

export default {
  computed: mapState([ 'filters' ]),
  mounted () {
    this.$store.commit('pageTitleSet', this.meta.title)
    this.initTable()
    this.moveColumnsButton()
    this.list()
    this.initTableListeners()
  },
  watch: {
    filters: {
      handler () {
        this.list()
      },
      deep: true
    }
  },
  methods: {
    initTable () {
      var config = {
        stateSave: true,
        colReorder: true,
        responsive: true,
        columns: this.meta.columns,
        fixedHeader: true,
        paging: false,
        dom: 'Bt',
        buttons: [ { extend: 'colvis', text: 'Visible Columns', className: 'ui button' } ]
      }

      this.table = $(this.$refs.table).DataTable(config)
    },
    list () {
      this.$root.req(this.meta.list, this.filters).then(response => {
        this.table.clear()
        this.table.rows.add(response)
        this.table.draw()
        this.table.columns.adjust().responsive.recalc()
      })
    },
    moveColumnsButton () {
      let className = this.meta.name + 'ColumnsButton'
      this.table.buttons().containers()
                    .appendTo($(`.${className}`))

      $(`.${className} .dt-buttons.ui.basic`).removeClass('basic').on('click', () => {
        $(`.${className} .dt-button-collection.vertical`).css('top', '-300px').css('height', '300px').css('overflow', 'scroll')
      })
    }
  }
}
