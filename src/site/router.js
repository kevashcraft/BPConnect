import Vue from 'vue'
import Router from 'vue-router'

import HomePage from '../components/Home/HomePage.vue'
import LoginPage from '../components/Login/LoginPage.vue'

import ConfigPage from '../components/Config/ConfigPage.vue'
import ConfigControls from '../components/Config/ConfigControls.vue'
import Dashboard from '../components/Dashboard/Dashboard.vue'
import InspectionsPage from '../components/Inspections/InspectionsPage.vue'
import InspectionsControls from '../components/Inspections/InspectionsControls.vue'
import OrdersPage from '../components/Orders/OrdersPage.vue'
import OrdersControls from '../components/Orders/OrdersControls.vue'
import PermitsPage from '../components/Permits/PermitsPage.vue'
import PermitsControls from '../components/Permits/PermitsControls.vue'
import SchedulePage from '../components/Schedule/SchedulePage.vue'
import ScheduleControls from '../components/Schedule/ScheduleControls.vue'
import SrcPage from '../components/Src/SrcPage.vue'
import SrcControls from '../components/Src/SrcControls.vue'
import TicketsPage from '../components/Tickets/TicketsPage.vue'
import TicketsControls from '../components/Tickets/TicketsControls.vue'
import WipPage from '../components/Wip/WipPage.vue'
import WipControls from '../components/Wip/WipControls.vue'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      component: HomePage
    }, {
      path: '/login',
      component: LoginPage
    }, {
      path: '/dashboard',
      components: {
        page: Dashboard
      },
      meta: {requiresAuth: true}
    }, {
      path: '/config',
      components: {
        page: ConfigPage,
        controls: ConfigControls
      },
      meta: {requiresAuth: true}
    }, {
      path: '/inspections',
      components: {
        page: InspectionsPage,
        controls: InspectionsControls
      },
      meta: {requiresAuth: true}
    }, {
      path: '/orders',
      components: {
        page: OrdersPage,
        controls: OrdersControls
      },
      meta: {requiresAuth: true}
    }, {
      path: '/permits',
      components: {
        page: PermitsPage,
        controls: PermitsControls
      },
      meta: {requiresAuth: true}
    }, {
      path: '/schedule',
      components: {
        page: SchedulePage,
        controls: ScheduleControls
      },
      meta: {requiresAuth: true}
    }, {
      path: '/site-ready-checklist',
      components: {
        page: SrcPage,
        controls: SrcControls
      },
      meta: {requiresAuth: true}
    }, {
      path: '/tickets',
      components: {
        page: TicketsPage,
        controls: TicketsControls
      },
      meta: {requiresAuth: true}
    }, {
      path: '/work-in-progress',
      components: {
        page: WipPage,
        controls: WipControls
      },
      meta: {requiresAuth: true}
    }],
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next({path: '/dashboard'})
  }
  // if (to.matched.some(record => record.meta.requiresAuth) && !S.authed) {
  //   next({path: '/login', query: { redirect: to.fullPath }})
  // } else {
  next()
  // }
})

export default router
