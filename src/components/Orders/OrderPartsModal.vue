<template>
  <div class="ui tiny modal">
    <i class="close icon"></i>
    <div class="header">Order Parts</div>
    <form class="ui form padding30">
      <div class="fields">
        <div class="ten wide field">
          <label>Supplier Search</label>
          <div ref="suppliersSearch" class="ui search">
            <div class="ui left icon input">
              <i class="shopping cart icon"></i>
              <input type="text" class="prompt" placeholder="Search for a supplier">
            </div>
          </div>
        </div>
        <div class="six wide field relative">
          <div class="ui left labeled icon button bottom" @click="openOrderSupplierAddModal"><i class="plus icon"></i>Add New Supplier</div>
        </div>
      </div>
      <div class="field">
        <label>Order Number</label>
        <div class="ui left icon input">
          <i class="list ol icon"></i>
          <input type="text" v-model="order.number" placeholder="Order number">
        </div>
      </div>
      <div class="field">
        <label>Total Cost</label>
        <div class="ui left icon input">
          <i class="usd icon"></i>
          <input type="text" v-model="order.total" placeholder="Total Cost">
        </div>
      </div>
      <div class="field">
        <label>Order Date</label>
        <div class="ui left icon input">
          <i class="calendar o icon"></i>
          <input type="date" v-model="order.ordered" placeholder="Order Date">
        </div>
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
      <div class="ui green icon button" @click="create">
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
      row: {},
      order: {
        ticketId: 0,
        number: '',
        total: '',
        parts: [],
        ordered: '',
      },
      parts: [],
    }
  },
  mounted () {

    $(this.$refs.suppliersSearch).search({
      apiSettings: {
        responseAsync: (settings, callback) => {
          let route = 'Suppliers:search'
          let data = { query: settings.urlData.query }
          this.$root.req(route, data).then(callback)
        }
      },
      selectFirstResult: true,
      onSelect: (result, response) => {
        this.order.supplierId = result.id
      },
    })
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
      this.$root.req('Tickets:retrieveParts', this.order).then(response => {
        this.parts = response

        setTimeout(() => {
          $('.ui.checkbox').checkbox()
        },100)
        setTimeout(() => {
          $(this.$el).modal('refresh')
        },250)
      })
    },
    create () {
      this.order.parts = this.parts.filter(part => { return part.ordered })
      this.$root.req('Orders:create', this.order).then(response => {
        if (response) {
          this.$root.noty('Order has been added')
          this.$emit('update', this.row)
          this.close()
        } else {
          this.$root.noty('Could not order parts', 'error')
        }
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
