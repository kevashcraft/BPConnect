export default {
  mounted () {
    this.$store.commit('pageTitleSet', this.meta.title)
  }
}
