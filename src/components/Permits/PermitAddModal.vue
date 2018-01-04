<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Add a Permit</div>
    <form class="ui form padding30">
      <div class="field fluid">
        <div ref="search" class="ui search">
          <label>Inspection Authority</label>
          <input type="text" class="prompt">
        </div>
      </div>
      <div class="field">
        <label>Permit Number</label>
        <input type="text" v-model="permit.name">
      </div>
      <div class="two fields">
        <div class="field">
          <label>Start Date</label>
          <input type="date" v-model="permit.starts">
        </div>
        <div class="field">
          <label>End Date</label>
          <input type="date" v-model="permit.ends">
        </div>
      </div>
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="update">
        Add Permit
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
          page: 'Permits',
          name: 'PermitAddModal'
        },
        permit: {
          name: '',
          starts: moment().format('YYYY-MM-DD'),
          ends: moment().add('days', 60).format('YYYY-MM-DD'),
        },
        wip: {
          ticketId : 0,
        },
      }
    },
    mounted: function() {
      this.permitTemplate = JSON.stringify(this.permit)
      $(this.$refs.search).search({
        apiSettings: {
          responseAsync: (settings, callback) => {
            let route = 'Inspectors:search'
            let data = { query: settings.urlData.query }
            this.$root.req(route, data).then(callback)
          }
        },
        selectFirstResult: true,
        onSelect: (result, response) => {
          this.permit.inspectorId = result.id
        },
      })
    },
    methods: {
      afterOpen: function({data, row}) {
        this.permit = JSON.parse(this.permitTemplate)
        this.permit.permitId = data.permitId
      },
      update: function(event) {
        if (!this.permit.inspectorId) this.$root.noty('Please select an inspector', 'warning')
        if (!this.permit.starts) this.$root.noty('Please add a start date', 'warning')
        if (!this.permit.ends) this.$root.noty('Please add an end date', 'warning')
        this.$root.req('Permits:update', this.permit).then((response) => {
          if (response) {
            this.$root.noty(`Created permit ${response}`)
            this.close()
            this.$emit('update')
          } else {
            this.$root.noty('Could not create permit', 'error')
          }
        })
      },
    }
  }
</script>