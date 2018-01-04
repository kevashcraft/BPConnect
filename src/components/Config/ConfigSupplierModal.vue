<template>
  <div class="ui tiny modal">
    <i class="close icon"></i>
    <div class="header">{{ method }} Supplier</div>
    <div class="content">
      <form class="ui form">
        <div class="field">
          <label>Supplier Name</label>
          <input type="text" v-model="supplier.name" placeholder="Supplier Name">
        </div>
        <div class="field">
          <label>Phone Number</label>
          <input type="text" v-model="supplier.phone" placeholder="Phone number">
        </div>
        <div class="field">
          <label>Email Address</label>
          <input type="email" v-model="supplier.email" placeholder="Email address">
        </div>
        <div class="field">
          <label>Street Address</label>
          <input type="text" v-model="supplier.address" placeholder="Street address">
        </div>
        <div class="field">
          <label>City, State & ZIP</label>
          <div class="ui search" ref="locations">
            <input type="text" class="prompt" placeholder="Location">
            <div class="results"></div>
          </div>
        </div>
      </form>
    </div>
    <div class="actions">
      <div class="ui left floated black deny button">Exit</div>
      <div class="ui left floated red button" @click="deleteIt" v-show="!supplier.deleted && method != 'Create'">Delete</div>
      <div class="ui left floated blue button" @click="undelete" v-show="supplier.deleted">UnDelete</div>
      <div class="ui green labeled icon button" @click="post">
        {{ this.method }}
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
          name: 'ConfigSupplierModal'
        },
        method: '',
        supplier: {},
        updating: false,
      }
    },
    mounted () {
      $(this.$el).find('.prompt').on('focus', function() { this.select() })
      $(this.$refs.locations).search({
        selectFirstResult: true,
        apiSettings: {
          responseAsync: (settings, callback) => {
            let route = 'Locations:search'
            let data = { query: settings.urlData.query }
            this.$root.req(route, data).then(callback)
          }
        },
        onSelect: (value) => {
          this.supplier.zipcodeId = value.id
        }
      })
    },
    methods: {
      afterOpen (supplier) {
        if (supplier) {
          this.supplier = supplier
          $(this.$refs.locations).search('set value', supplier.citystate)
          this.method = 'Update'
        } else {
          this.method = 'Create'
          this.supplier = {
            name: '',
          }
          $(this.$refs.locations).search('set value', '')
        }
      },
      post () {
        let method = this.method.toLowerCase()
        if (this.validate()) {
          this[method]()
        }
      },
      validate () {
        let valid = true
        this.supplier.name = this.supplier.name.trim()
        if (!this.supplier.name.length) {
          this.$root.noty('Provide a supplier name', 'warning')
          valid = false
        }

        return valid
      },
      create () {
        this.$root.req('Suppliers:create', this.supplier).then((response) => {
          if (response) {
            this.close()
            this.$emit('update')
            this.$root.noty(`Supplier has been created`)
          } else {
            this.$root.noty('Could not create the supplier', 'error')
          }
        })
      },
      deleteIt () {
        this.$root.req('Suppliers:delete', this.supplier).then((response) => {
          if (response) {
            this.close()
            this.$emit('update')
            this.$root.noty(`Supplier has been deleted`)
          } else {
            this.$root.noty('Could not undelete the supplier', 'error')
          }
        })
      },
      undelete () {
        this.$root.req('Suppliers:undelete', this.supplier).then((response) => {
          if (response) {
            this.close()
            this.$emit('update')
            this.$root.noty(`Supplier has been undeleted`)
          } else {
            this.$root.noty('Could not undelete the supplier', 'error')
          }
        })
      },
      update (event) {
        this.$root.req('Suppliers:update', this.supplier).then((response) => {
          if (response) {
            this.close()
            this.$emit('update')
            this.$root.noty(`Supplier has been updated`)
          } else {
            this.$root.noty('Could not update the supplier', 'error')
          }
        })
      },
    },
  }
</script>
