<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Start Work</div>
    <form class="ui form padding30">
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="update">
        Start Work
        <i class="arrow circle outline right icon"></i>
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
        name: 'WipStartModal'
      },
      ticket: {},
    }
  },
  methods: {
    afterOpen (ticket) {
      this.ticket = ticket
    },
    update (event) {
      this.$root.req('Wip:updateStarted', this.ticket).then((response) => {
        if (response) {
          this.$root.noty('Ticket work has been started')
          this.$emit('update')
          this.close()
        } else {
          this.$root.noty('Could not start ticket work', 'error')
        }
      })
    },
  },
}
</script>
