<template>
  <div class="ui tiny modal">
    <i class="close icon"></i>
    <div class="header">Update Subdivision</div>
    <div class="content">
      <form class="ui form" @submit="update">
        <div class="one field">
          <div class="field">
            <label>Subdivision Name</label>
            <input type="text" v-model="subdivision.name" placeholder="Subdivision Name">
          </div>
          <div class="field">
            <label>City, State & ZIP</label>
            <div class="ui search zips">
              <input type="text" class="prompt">
              <div class="results"></div>
            </div>
          </div>
        </div>
        <div hidden>
          <input type="submit">
        </div>
      </form>
    </div>
    <div class="actions">
      <div class="ui left floated black deny button">Exit</div>
      <div class="ui positive right floasted labeled icon button" @click="update" v-show="type === 'update'">
        Save
        <i class="checkmark icon"></i>
      </div>
      <div class="ui positive right floasted labeled icon button" @click="create" v-show="type === 'create'">
        Create
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
        type: '',
        subdivision: {},
        updating: false,
      }
    },
    methods: {
      afterOpen (subdivision) {
        if (subdivision) {
          this.subdivision = subdivision
          this.type = 'update'
        } else {
          this.type = 'create'
          this.subdivision = {
            name: '',
          }
        }
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
