import { mapState } from 'vuex'

export default {
  computed: mapState([ 'filters' ]),
  mounted () {
    this.$store.commit('pageTitleSet', this.meta.title)
    this.init()
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
    moveColumnsButton () {
      let className = this.meta.name.replace('Page', '') + 'ColumnsButton'
      this.table.buttons().containers()
                    .appendTo($(`.${className}`))

      $(`.${className} .dt-buttons.ui.basic`).removeClass('basic').on('click', () => {
        $(`.${className} .dt-button-collection.vertical`).removeClass('vertical').removeClass('basic').addClass('horizontal').css('width', '80vw').css('overflow-x', 'auto')
      })
    }
  }
}
