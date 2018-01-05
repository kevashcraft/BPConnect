<template>
  <div class="ui tiny modal">
    <i class="close icon"></i>
    <div class="header">Add a Permit</div>
    <form class="ui form padding30">
      <div class="field fluid">
        <label>Inspection Authority</label>
        <div ref="search" class="ui search">
          <div class="ui left icon input">
            <i class="spy icon"></i>
            <input type="text" class="prompt" placeholder="Inspection Authority search">
          </div>
        </div>
      </div>
      <div class="field">
        <label>Permit Number</label>
        <div class="ui left icon input">
          <i class="clipboard icon"></i>
          <input type="text" v-model="permit.name" placeholder="Permit number">
        </div>
      </div>
      <div class="two fields">
        <div class="field">
          <label>Start Date</label>
          <div class="ui left icon input">
            <input type="date" v-model="permit.starts">
            <i class="calendar o icon"></i>
          </div>
        </div>
        <div class="field">
          <label>End Date</label>
          <div class="ui left icon input">
            <i class="calendar o icon"></i>
            <input type="date" v-model="permit.ends">
          </div>
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
            this.$root.noty(`Created permit ${this.permit.name}`)
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