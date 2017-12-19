<template>
  <div id="app">
    <!-- <div v-if="S.authed"> -->
      <div class="ui inverted dimmer" id="site_loader">
        <div class="ui loader"></div>
      </div>
      <div class="ui left vertical main menu sidebar visible inverted" id="sidebar">
        <a href="/" title="BPConnect" class="item padding15">
          <img src="/images/bpconnect-logo.svg" width="200px">
        </a>
        <div class="ui page dropdown item" ref="menu">
          <span>
            <i class="menu icon"></i>
            <span>{{ pageTitle }}</span>
          </span>
          <i class="dropdown icon"></i>
          <div class="menu">
            <router-link class="item" to="tickets">
              <i class="list layout icon"></i>
              Tickets
            </router-link>
            <router-link class="item" to="orders">
              <i class="shop icon"></i>
              Orders
            </router-link>
            <router-link class="item" to="permits">
              <i class="file powerpoint outline icon"></i>
              Permits
            </router-link>
            <router-link class="item" to="site-ready-checklist">
              <i class="checkmark box icon"></i>
              Site Ready Checklist
            </router-link>
            <router-link class="item" to="schedule">
              <i class="calendar icon"></i>
              Schedule
            </router-link>
            <router-link class="item" to="work-in-progress">
              <i class="terminal icon"></i>
              Work in Progress
            </router-link>
            <router-link class="item" to="inspections">
              <i class="info icon"></i>
              Inspections
            </router-link>
            <router-link class="item" to="billing">
              <i class="money icon"></i>
              Billing
            </router-link>
            <router-link class="item" to="config">
              <i class="settings icon"></i>
              Config
            </router-link>
            <router-link class="item" to="reports">
              <i class="bar chart icon"></i>
              Reports
            </router-link>
          </div>
        </div>
        <div class="controls">
          <router-view name="controls"></router-view>
        </div>
      </div>
      <div class="pusher">
        <router-view name="page"></router-view>
      </div>
    <!-- </div> -->
<!--     <div v-else>
      <login-page></login-page>
    </div>
 -->  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    computed: {
      pageTitle () { return this.$store.state.pageTitle },
    },
    components: {
    },
    mounted () {
      $(document).ready(() => {
        $(this.$refs.menu).dropdown({on: 'hover'});
        $('.pop-up[data-content]').popup();
      })
      //   var state = window.innerWidth > 800 ? 'show' : 'hide';
      // //   $('.ui.sidebar').sidebar(state);
    },
  }
</script>
