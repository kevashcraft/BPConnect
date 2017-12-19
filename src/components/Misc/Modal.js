export default {
  data () {
    return {
      opened: false,
    }
  },
  computed: {
    modal () {
      return this.$store.state.modal
    },
  },
  mounted () {
    $(this.$el).modal({
      closable: false,
      onHidden: () => {
        if (this.modal === this.meta.name) {
          this.$store.commit('modalEmpty')
        }
      }
    })
  },
  methods: {
    open (data) {
      this.opened = true
      $(this.$el).modal('show')
      if (this.modal !== this.meta.name) {
        this.$store.commit('modalSet', this.meta.name)
      }
      if (this.afterOpen) this.afterOpen(data)
    },
    close (data) {
      this.opened = false
      $(this.$el).modal('hide')
      if (this.modal === this.meta.name) {
        this.$store.commit('modalEmpty')
      }
      if (this.afterClose) this.afterClose(data)
    },
  },
  watch: {
    modal (n, o) {
      if (n === this.meta.name && !this.opened) {
        this.open()
      }

      if (o === this.meta.name && this.opened) {
        this.close()
      }
    },
  }
}
