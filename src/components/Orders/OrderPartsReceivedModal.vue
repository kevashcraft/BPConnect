<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Parts Received</div>
    <form class="ui form padding30">
      <div v-for="part in parts" class="padding5">
        <div class="ui slider checkbox part">
          <input type="checkbox" v-model="part.received">
          <label>{{ part.description }}</label>
        </div>
      </div>
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui blue button" @click="selectAll">Select All</div>
      <div class="ui green icon button" @click="update">
        Parts Received
        <i class="checkmark icon"></i>
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
        page: 'Orders',
        name: 'OrderPartsReceivedModal'
      },
      row: {},
      parts: [],
      orderId: 0,
    }
  },
  methods: {
    afterOpen (obj) {
      this.row = obj.row
      this.orderId = obj.data.orderId
      this.retrieve()
    },

    retrieve () {
      let data = {orderId: this.orderId}
      this.$root.req('Orders:retrieveParts', data).then(response => {
        this.parts = response

        setTimeout(() => {
          $('.ui.checkbox').checkbox()
        },100)
        setTimeout(() => {
          $(this.$el).modal('refresh')
        },250)
      })
    },
    update () {
      this.parts.forEach(part => { console.log('part.received', part.received)})
      let parts = this.parts.filter(part => { return part.received === true || part.received === false })

      this.$root.req('Orders:receiveParts', { parts }).then(response => {
        this.$emit('update', this.row)
      })
    },
    selectAll () {
      $('.ui.checkbox.part').checkbox('check')
    },
  }
}
</script>
