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
      row: {},
      wip: {},
    }
  },
  methods: {
    afterOpen: function({data, row}) {
      this.row  = row
      this.$set('wip', {
        ticket_id: data.ticket_id,
        // starts: moment().format('YYYY-MM-DD'),
      })
    },
    update: function(event) {
      // var data = {
      //   data: this.wip,
      // }
      // $.post(BPC.routes['wip.start'], data, function(data) {
      //   BPC.overhang(data.message, data.success, 2)
      //   if (data.success) {
      //     $(this.$el).modal('hide')
      //     BPC.wip.update()
      //   }
      // }.bind(this), 'json')
    },
  },
}
</script>
