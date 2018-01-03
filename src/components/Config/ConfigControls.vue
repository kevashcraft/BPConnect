<template>
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
    <br>
    <div class="segment">
      <div class="ui fluid button" @click="createOpen">Add New</div>
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
      configs: [
        {
          value: 'builders',
          title: 'Builders',
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
          value: 'subdivisions',
          title: 'Subdivisions',
          list: 'Subdivisions:list',
          modal: 'ConfigSubdivisionModal',
          columns: [
            {
              title: 'Subdivision',
              data: 'name'
            }, {
              title: 'Builder',
              data: 'builder'
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
  },
  methods: {
    createOpen () {
      this.$store.dispatch('modalOpen', this.config.modal)
    }
  }
}
</script>
