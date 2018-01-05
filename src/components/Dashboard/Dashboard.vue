<template>
  <div>
    <div class="page-container" id="dashboard">
      <div class="tiles">

        <router-link class="ui segment" to="/tickets">
          <i class="list layout icon"></i>
          <span>Tickets</span>
        </router-link>

        <router-link class="ui segment" to="/orders">
          <i class="shop icon"></i>
          <span>Orders</span>
        </router-link>

        <router-link class="ui segment" to="/permits">
          <i class="file powerpoint outline icon"></i>
          <span>Permits</span>
        </router-link>

        <router-link class="ui segment" to="/site-ready-checklist">
          <i class="checkmark box icon"></i>
          <span>Site Ready Checklist</span>
        </router-link>

        <router-link class="ui segment" to="/schedule">
          <i class="calendar icon"></i>
          <span>Schedule</span>
        </router-link>

        <router-link class="ui segment" to="/work-in-progress">
          <i class="terminal icon"></i>
          <span>Work in Progress</span>
        </router-link>

        <router-link class="ui segment" to="/inspections">
          <i class="info icon"></i>
          <span>Inspections</span>
        </router-link>

        <router-link class="ui segment" to="/config">
          <i class="settings icon"></i>
          <span>Config</span>
        </router-link>

<!--         <a class="ui segment" @click="openRollOut">
          <i class="calendar icon"></i>
          <span>Rollout</span>
        </a> -->
      </div>
    </div>
    <dashboard-rollout-modal ref="rollout"></dashboard-rollout-modal>
  </div>
</template>

<script>
  import Page from '../Page/Page'

  import './Dashboard.scss'
  import DashboardRolloutModal from './DashboardRolloutModal.vue'

  export default {
    data () {
      return {
        meta: {
          title: 'Dashboard'
        },
      }
    },
    mixins: [ Page ],
    methods: {
      init () {

      },
      openRollOut () {
        console.log("here");
        this.$refs.rollout.open()
      }
    },
    components: {
      DashboardRolloutModal
    }
  }
</script>
