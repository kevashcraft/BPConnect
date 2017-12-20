<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Order Parts</div>
    <form class="ui form padding30">
      <div class="two fields">
        <div class="field">
          <div class="ui search">
            <label>Supplier</label>
            <input type="text" class="prompt" v-model="search">
          </div>
        </div>
        <div class="field">
          <div class="ui button" @click="openOrderSupplierAddModal">Add New</div>
        </div>
      </div>
      <div class="field">
        <label>Order Number</label>
        <input type="text" v-model="order.number">
      </div>
      <div class="field">
        <label>Total Cost</label>
        <input type="text" v-model="order.total" placeholder="Total Cost">
      </div>
      <div class="field">
        <label>Order Date</label>
        <input type="date" v-model="order.ordered" placeholder="Order Date">
      </div>
      <div v-for="part in parts">
        <div class="ui checkbox part">
          <label>{{ part.description }}</label>
          <input type="checkbox" v-model="part.ordered">
        </div>
      </div>
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui blue button" @click="selectAll">Select All</div>
      <div class="ui green icon button" @click="submit">
        Parts Ordered
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
        name: 'OrderPartsModal'
      },
      search: '',
      row: {},
      order: {},
      parts: [],
    }
  },
  mounted () {

    // $(this.$el).modal({allowMultiple: true})
    // $('#orderPartsModal .ui.search').search({
    //   apiSettings: {
    //     url: BPC.r.orders.suppliersSearch + '?query={query}',
    //     method: 'post'
    //   },
    //   selectFirstResult: true,
    //   onSelect  (result, response) {
    //     console.log("result",result)
    //     this.order.supplierId = result.id
    //   }.bind(this),
    // })
  },
  methods: {
    afterOpen (obj) {
      this.row  = obj.row
      this.order = {
        ticketId: obj.data.ticketId,
        number: '',
        total: '',
        parts: [],
        ordered  : moment().format('YYYY-MM-DD'),
      }

      // this.$set('search', '')

      this.list()
    },
    list () {
      let data = {orderId: this.orderId}
      this.$root.req('Orders:listParts', data).then(response => {
        this.parts = response

        setTimeout(() => {
          $('.ui.checkbox').checkbox()
        },100)
        setTimeout(() => {
          $(this.$el).modal('refresh')
        },250)
      })
    },
    submit () {
      this.$root.req('Orders:createParts', this.parts).then(response => {
        this.$emit('update', this.row)
      })
    },
    selectAll () {
      $('.ui.checkbox.part').checkbox('check')
    },
    openOrderSupplierAddModal  () {
      this.$store.dispatch('modalSave', 'OrderSupplierAddModal')
    },
  }
}
</script>
