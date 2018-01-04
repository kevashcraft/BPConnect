<template>
  <div>
    <div class="item">
      <div class="segment">
        <div class="ui fluid selection dropdown" ref="dropdown">
          <input type="hidden">
          <i class="dropdown icon"></i>
          <div class="default text">Select List</div>
          <div class="menu">
            <div class="item" v-for="c in configs" :data-value="c.value">{{ c.title }}</div>
          </div>
        </div>
      </div>
      <div class="segment">
        <div class="ui toggle checkbox">
          <input type="checkbox" v-model="configDeleted" @change="configDeletedSet">
          <label>Show Deleted</label>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="ui fluid green button" @click="createOpen">Add New {{ config.singular }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      meta: {
        name: 'ConfigControls',
      },
      selected: '',
      configDeleted: false,
      configs: [
        {
          value: 'builders',
          title: 'Builders',
          singular: 'Builder',
          list: 'Builders:list',
          modal: 'ConfigBuilderModal',
          columns: [
            {
              title: 'Builder',
              data: 'name'
            }, {
              title: 'Address',
              data: 'address'
            }, {
              title: 'Email',
              data: 'email'
            }, {
              title: 'Phone',
              data: 'phone'
            }
          ]
        }, {
          value: 'inspectors',
          title: 'Inspection Authorities',
          singular: 'Inspection Authority',
          list: 'Inspectors:list',
          modal: 'ConfigInspectorModal',
          columns: [
            {
              title: 'Inspection Authority',
              data: 'name'
            }, {
              title: 'Email',
              data: 'email'
            }, {
              title: 'Phone',
              data: 'phone'
            }, {
              title: 'Fax',
              data: 'fax'
            }, {
              title: 'Website',
              data: 'url'
            }, {
              title: 'Address',
              data: 'address'
            }, {
              title: 'Location',
              data: 'citystate'
            }
          ]
        }, {
          value: 'subdivisions',
          title: 'Subdivisions',
          singular: 'Subdivision',
          list: 'Subdivisions:list',
          modal: 'ConfigSubdivisionModal',
          columns: [
            {
              title: 'Subdivision',
              data: 'name'
            }, {
              title: 'Builder',
              data: 'builder'
            }, {
              title: 'Location',
              data: 'citystate'
            }
          ]
        }, {
          value: 'suppliers',
          title: 'Suppliers',
          singular: 'Supplier',
          list: 'Suppliers:list',
          modal: 'ConfigSupplierModal',
          columns: [
            {
              title: 'Supplier',
              data: 'name'
            }, {
              title: 'Phone Number',
              data: 'phone'
            }, {
              title: 'Email',
              data: 'email'
            }, {
              title: 'Fax',
              data: 'fax'
            }, {
              title: 'Address',
              data: 'address'
            }, {
              title: 'Location',
              data: 'citystate'
            }
          ]
        }
      ]
    }
  },
  computed: mapState(['config']),
  mounted () {
    $(this.$refs.dropdown).dropdown({
      onChange: (value) => {
        let config = this.configs.find(c => { return c.value === value })
        this.$store.commit('configSet', config)
      }
    })
    if (this.config) {
      $(this.$refs.dropdown).dropdown('set selected', this.config.value)
    }
    this.configDeleted = this.$store.state.configDeleted
    $(this.$el).find('.ui.toggle.checkbox').checkbox()
  },
  methods: {
    createOpen () {
      this.$store.dispatch('modalOpen', this.config.modal)
    },
    configDeletedSet () {
      console.log('this.configDeleted', this.configDeleted)
      this.$store.commit('configDeletedSet', this.configDeleted)
    }
  }
}
</script>
