<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Checkin Work</div>
    <form class="ui form padding30">
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="update">
        Checkin Ticket
        <i class="external share icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from '../Modal/Modal'

export default {
  mixins: [ Modal ],
  data () {
    return {
      meta: {
        name: 'WipCheckinModal'
      },
      ticket: {},
    }
  },
  methods: {
    afterOpen (ticket) {
      this.ticket = ticket
    },
    update () {
      this.$root.req('Wip:updateCompleted', this.ticket).then((response) => {
        if (response) {
          this.$root.noty('Ticket work has been completed')
          this.$emit('update')
          this.close()
        } else {
          this.$root.noty('Could not complete ticket work', 'error')
        }
      })
    },
  },
}
</script>
