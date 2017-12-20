<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Add Reason</div>
    <form class="padding30 center aligned" @submit.prevent="submit">
      <div class="field">
        <div class="ui input">
          <label>Reason</label>
          <input type="text" v-model="reason.reason" placeholder="Reason">
        </div>
      </div>
      <div class="field">
        <div class="ui slider checkbox">
          <label>Builder's Fault</label>
          <input type="checkbox" v-model="reason.builders_fault">
        </div>
      </div>
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green button" @click="submit">Add</div>
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
        page: 'Sites',
        name: 'SiteReasonAddModal'
      },
      reason: {},
    }
  },
  methods: {
    afterOpen () {
      this.reason = {
        reason: '',
        builders_fault: false,
      }
    },
    submit () {
      // var data = { reason: this.reason }
      // $.post(BPC.r.sites.reason_add, data, function (data) {
      //   BPC.overhang(data.message, data.success)
      //   if (data.success) {
      //     $(this.$el).modal('hide')
      //   }
      // }.bind(this), 'json')
    },
  }
}
</script>
