<template>
  <div class="ui modal" id="rollout-modal">
    <i class="close icon"></i>
    <div class="header">Rollout Schedule</div>
    <div class="content">
      <ul>
        <li>Feb 7: Import Database</li>
        <li>Feb 10: Kristie Add Ticket</li>
        <li>Feb 13: Training 1: Kristie/Logan/Scott</li>
        <li>Feb 17: Training 2: Kristie/Logan/Scott</li>
        <li>Feb 20: Import DB</li>
        <li>Feb 21: Launch</li>
      </ul>
    </div>
    <div class="actions">
      <div class="ui deny icon button" @click="update">
        Close
        <i class="close icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    methods: {
      open: () => {
        $('#rollout-modal').modal('show')
      },
      update: () => {}
    }
  }
</script>
