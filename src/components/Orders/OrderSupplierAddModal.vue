<template>
  <div class="ui tiny modal" id="supplier_add_modal">
    <i class="close icon"></i>
    <div class="header">Add Supplier</div>
    <form class="ui form padding30 center aligned">
      <div class="field">
        <label>Supplier</label>
        <div class="ui left icon input">
          <i class="shopping cart icon"></i>
          <input type="text" v-model="supplier.name" placeholder="Supplier name">
        </div>
      </div>
      <div class="field">
        <label>Address</label>
        <div class="ui left icon input">
          <i class="map market icon"></i>
          <input type="text" v-model="supplier.address" placeholder="Supplier address">
        </div>
      </div>
      <div class="field">
        <label>Phone Number</label>
        <div class="ui left icon input">
          <i class="phone icon"></i>
          <input type="text" v-model="supplier.phone" placeholder="Supplier phone number">
        </div>
      </div>
    </form>
    <div class="actions">
      <button class="ui black button left floated" @click="close">Exit</button>
      <button class="ui green button" @click="create">Add</button>
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
        name: 'OrderSupplierAddModal'
      },
      supplier: {},
    }
  },
  methods: {
    afterOpen: function() {
      this.supplier = {
        name     : '',
        address  : '',
        phone    : '',
      }
    },
    create: function() {
      this.$root.req('Suppliers:create', this.supplier).then(response => {
        if (response) {
          this.close()
          this.$emit('update')
          this.$root.noty(`Supplier ${response} has been added`)
        } else {
          this.$root.noty('Could not add the supplier', 'error')
        }
      })
    },
  }
}
</script>
