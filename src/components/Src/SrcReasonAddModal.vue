<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Add Reason</div>
    <form class="padding30 center aligned" @submit.prevent="create">
      <div class="field">
        <div class="ui input">
          <label>Reason</label>
          <input type="text" v-model="reason.reason" placeholder="Reason">
        </div>
      </div>
      <div class="field">
        <div class="ui slider checkbox">
          <label for="reason_buildersFault">Builder's Fault</label>
          <input type="checkbox" id="reason_buildersFault" v-model="reason.buildersFault">
        </div>
      </div>
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green button" @click="create">Add</div>
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
        name: 'SrcReasonAddModal'
      },
      reason: {},
    }
  },
  methods: {
    afterOpen () {
      this.reason = {
        reason: '',
        buildersFault: false,
      }
      setTimeout(() => {
        $('.ui.checkbox').checkbox()
      },100)
    },
    create () {
      this.reason.fault = this.reason.buildersFault ? 'builders' : 'bp'
      this.$root.req('Reasons:create', this.reason).then((response) => {
        if (response) {
          this.$root.noty('Reason has been added')
          this.close()
        } else {
          this.$root.noty('Could not add reason', 'error')
        }
      })
    },
  }
}
</script>
