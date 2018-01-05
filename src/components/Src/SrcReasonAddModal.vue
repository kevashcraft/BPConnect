<template>
  <div class="ui tiny modal">
    <i class="close icon"></i>
    <div class="header">Add Reason</div>
    <div class="content">
      <div class="ui icon message">
        <i class="bars icon"></i>
        <div class="content">
          <div class="header">Add New Reason</div>
          <p>Add a new reason why the site is not ready.</p>
        </div>
      </div>
      <form class="ui form padding30" @submit.prevent="create">
        <div class="fluid field">
          <label>Reason not Ready</label>
          <div class="ui left icon input">
            <i class="bars icon"></i>
            <input type="text" v-model="reason.reason" placeholder="Reason not ready">
          </div>
        </div>
        <div class="field" style="text-align: center">
          <div class="ui slider checkbox">
            <label for="reason_buildersFault">Is it the Builder's Fault</label>
            <input type="checkbox" id="reason_buildersFault" v-model="reason.buildersFault">
          </div>
        </div>
      </form>
    </div>
    <div class="actions">
      <div class="ui black button left floated" @click="close">Exit</div>
      <div class="ui green labeled icon button" @click="create"><i class="plus icon"></i>Add Reason</div>
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
