<template>
  <div class="ui tiny modal">
    <i class="close icon"></i>
    <div class="header">{{ method }} Inspection Authority</div>
    <div class="content">
      <form class="ui form">
        <div class="field">
          <label>Inspection Authority</label>
          <input type="text" v-model="inspector.name" placeholder="Inspection Authority">
        </div>
        <div class="field">
          <label>Website</label>
          <input type="url" v-model="inspector.url" placeholder="Website">
        </div>
        <div class="field">
          <label>Phone Number</label>
          <input type="text" v-model="inspector.phone" placeholder="Phone number">
        </div>
        <div class="field">
          <label>Fax Number</label>
          <input type="text" v-model="inspector.fax" placeholder="Fax number">
        </div>
        <div class="field">
          <label>Email Address</label>
          <input type="email" v-model="inspector.email" placeholder="Email address">
        </div>
        <div class="field">
          <label>Street Address</label>
          <input type="text" v-model="inspector.address" placeholder="Street address">
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
      <div class="ui left floated red button" @click="deleteIt" v-show="!inspector.deleted && method != 'Create'">Delete</div>
      <div class="ui left floated blue button" @click="undelete" v-show="inspector.deleted">UnDelete</div>
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
          name: 'ConfigInspectorModal'
        },
        method: '',
        inspector: {},
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
          this.inspector.zipcodeId = value.id
        }
      })
    },
    methods: {
      afterOpen (inspector) {
        if (inspector) {
          this.inspector = inspector
          $(this.$refs.locations).search('set value', inspector.citystate)
          this.method = 'Update'
        } else {
          this.method = 'Create'
          this.inspector = {
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
        this.inspector.name = this.inspector.name.trim()
        if (!this.inspector.name.length) {
          this.$root.noty('Provide a inspector name', 'warning')
          valid = false
        }

        return valid
      },
      create () {
        this.$root.req('Inspectors:create', this.inspector).then((response) => {
          if (response) {
            this.close()
            this.$emit('update')
            this.$root.noty(`Inspector has been created`)
          } else {
            this.$root.noty('Could not create the inspector', 'error')
          }
        })
      },
      deleteIt () {
        this.$root.req('Inspectors:delete', this.inspector).then((response) => {
          if (response) {
            this.close()
            this.$emit('update')
            this.$root.noty(`Inspector has been deleted`)
          } else {
            this.$root.noty('Could not undelete the inspector', 'error')
          }
        })
      },
      undelete () {
        this.$root.req('Inspectors:undelete', this.inspector).then((response) => {
          if (response) {
            this.close()
            this.$emit('update')
            this.$root.noty(`Inspector has been undeleted`)
          } else {
            this.$root.noty('Could not undelete the inspector', 'error')
          }
        })
      },
      update (event) {
        this.$root.req('Inspectors:update', this.inspector).then((response) => {
          if (response) {
            this.close()
            this.$emit('update')
            this.$root.noty(`Inspector has been updated`)
          } else {
            this.$root.noty('Could not update the inspector', 'error')
          }
        })
      },
    },
  }
</script>
