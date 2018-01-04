<template>
  <div class="ui tiny modal">
    <i class="close icon"></i>
    <div class="header">Update Subdivision</div>
    <div class="content">
      <form class="ui form">
        <div class="field">
          <label>Subdivision Name</label>
          <input type="text" v-model="subdivision.name" placeholder="Subdivision Name">
        </div>
        <div class="field">
          <label>Builder</label>
          <div class="ui search" ref="builders">
            <input type="text" class="prompt" placeholder="Builder">
            <div class="results"></div>
          </div>
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
      <div class="ui left floated red button" @click="deleteIt" v-show="!subdivision.deleted">Delete</div>
      <div class="ui left floated blue button" @click="undelete" v-show="subdivision.deleted">UnDelete</div>
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
          name: 'ConfigSubdivisionModal'
        },
        method: '',
        subdivision: {},
        updating: false,
      }
    },
    mounted () {
      $(this.$el).find('.prompt').on('focus', function() { this.select() })
      $(this.$refs.builders).search({
        selectFirstResult: true,
        apiSettings: {
          responseAsync: (settings, callback) => {
            let route = 'Builders:search'
            let data = { query: settings.urlData.query }
            this.$root.req(route, data).then(callback)
          }
        },
        onSelect: (value) => {
          this.subdivision.builderId = value.id
        },
      })
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
          this.subdivision.zipcodeId = value.id
        }
      })
    },
    methods: {
      afterOpen (subdivision) {
        if (subdivision) {
          this.subdivision = subdivision
          $(this.$refs.builders).search('set value', subdivision.builder)
          $(this.$refs.locations).search('set value', subdivision.citystate)
          this.method = 'Update'
        } else {
          this.method = 'Create'
          this.subdivision = {
            name: '',
          }
          $(this.$refs.builders).search('set value', '')
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
        this.subdivision.name = this.subdivision.name.trim()
        if (!this.subdivision.name.length) {
          this.$root.noty('Provide a subdivision name', 'warning')
          valid = false
        }
        if (!this.subdivision.builderId) {
          this.$root.noty('Select a builder', 'warning')
          valid = false
        }
        if (!this.subdivision.zipcodeId) {
          this.$root.noty('Select a location', 'warning')
          valid = false
        }

        return valid
      },
      create () {
        this.$root.req('Subdivisions:create', this.subdivision).then((response) => {
          if (response) {
            this.close()
            this.$emit('update')
            this.$root.noty(`Subdivision has been created`)
          } else {
            this.$root.noty('Could not create the subdivision', 'error')
          }
        })
      },
      deleteIt () {
        this.$root.req('Subdivisions:delete', this.subdivision).then((response) => {
          if (response) {
            this.close()
            this.$emit('update')
            this.$root.noty(`Subdivision has been deleted`)
          } else {
            this.$root.noty('Could not undelete the subdivision', 'error')
          }
        })
      },
      undelete () {
        this.$root.req('Subdivisions:undelete', this.subdivision).then((response) => {
          if (response) {
            this.close()
            this.$emit('update')
            this.$root.noty(`Subdivision has been undeleted`)
          } else {
            this.$root.noty('Could not undelete the subdivision', 'error')
          }
        })
      },
      update (event) {
        this.$root.req('Subdivisions:update', this.subdivision).then((response) => {
          if (response) {
            this.close()
            this.$emit('update')
            this.$root.noty(`Subdivision has been updated`)
          } else {
            this.$root.noty('Could not update the subdivision', 'error')
          }
        })
      },
    },
  }
</script>
