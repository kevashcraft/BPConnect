export default {
  data () {
    return {
      opened: false
    }
  },
  computed: {
    modal () {
      return this.$store.state.modal
    }
  },
  mounted () {
    $(this.$el).modal({
      closable: false,
      onHidden: () => {
        if (this.modal === this.meta.name) {
          this.$store.dispatch('modalNext')
        }
      }
    })
  },
  methods: {
    beforeOpen (callback, data) {
      callback(data)
      console.log('beforeOpen')
    },
    open (data) {
      console.log('open')
      this.beforeOpen(this.openActual, data)
    },
    openActual (data) {
      console.log('actual!')
      this.opened = true
      $(this.$el).modal('show')
      if (this.modal !== this.meta.name) {
        this.$store.commit('modalSet', this.meta.name)
      }

      if (this.$store.state.modalStack.indexOf(this.meta.name) < 0) {
        if (this.afterOpen) {
          try {
            data = JSON.parse(JSON.stringify(data))
          } catch (e) {
            console.log('Could not parse json')
          }

          this.afterOpen(data)
        }
      }

      setTimeout(() => {
        $(this.$el).modal('refresh')
      }, 15)
    },
    close (data, outside) {
      this.opened = false
      $(this.$el).modal('hide')
      if (!outside) {
        this.$store.dispatch('modalNext')
      }

      if (this.afterClose) this.afterClose(data)
    }
  },
  watch: {
    modal (n, o) {
      console.log('this.meta.name', this.meta.name)
      if (n === this.meta.name && !this.opened) {
        this.open()
      }

      if (o === this.meta.name && this.opened) {
        this.close({}, true)
      }
    }
  }
}
