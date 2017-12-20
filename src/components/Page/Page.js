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
}
