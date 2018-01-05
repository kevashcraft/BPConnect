<template>
  <div class="ui tiny modal">
    <i class="close icon"></i>
    <div class="header">Update Workers</div>
    <div class="content">
      <div class="ui icon message">
        <i class="users icon"></i>
        <div class="content">
          <div class="header">Plumber & Helpers</div>
          <p>Select the plumber and helpers for this job.</p>
        </div>
      </div>
      <div v-show="ticket.workers.length">
        <div class="ui dividing header">Workers</div>
        <table class="ui table" v-show="ticket.workers.length">
          <thead>
            <tr>
              <th>Type</th>
              <th>Worker</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="worker in ticket.workers">
              <td class="capitalize">{{ worker.type }}</td>
              <td>{{ worker.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <form class="ui form padding30">
        <div class="fluid field">
          <div class="ui search" ref="search">
            <label>Worker Search</label>
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" class="prompt" v-model="search" placeholder="Search for a worker">
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="update">
        Update Workers
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
        name: 'ScheduleUpdateWorkersModal'
      },
      row: {},
      ticket: {
        workers: [],
      },
      search: '',
    }
  },
  computed: {
    workers () {
      return this.$store.state.workers
    },
  },
  mounted () {
    $(this.$refs.search).search({
      type: 'category',
      apiSettings: {
        responseAsync: (settings, callback) => {
          let route = 'Workers:search'
          let data = { query: settings.urlData.query }
          this.$root.req(route, data).then((response) => {
            callback(response)
            this.refresh()
          })
        }
      },
      selectFirstResult: true,
      onSelect: (result, response) => {
        let worker = {
          type: result.type,
          userId: result.id,
          name: result.title
        }
        console.log('worker', worker)
        if (result.type === 'plumber' && this.ticket.workers.some(el => { return el.type === 'plumber'})) {
          this.$root.notyConfirm('Do you want to replace the current plumber?', (response) => {
            console.log('response', response)
            if (response.success) {
              let workers = [worker]
              this.ticket.workers.forEach(tW => {
                if (tW.type !== 'plumber')
                  workers.push(tW)
              })

              this.$set(this.ticket, 'workers', workers)
              this.searchClear()
            }
          })
        } else {
          this.ticket.workers.push(worker)
          this.searchClear()
        }
      },
    })
  },
  methods: {
    afterOpen (ticket) {
      if (!ticket.workers) {
        ticket.workers = []
      }
      this.ticket = ticket

      this.retrieve()
      this.searchClear()
    },
    retrieve () {
      this.$root.req('TicketWorkers:retrieve', this.ticket).then((response) => {
        this.$set(this.ticket, 'workers', response)
      })
    },
    update () {
      this.$root.req('TicketWorkers:update', this.ticket).then((response) => {
        if (response) {
          this.$root.noty('The workers have been updated')
          this.$emit('update')
          this.close()
        }
      })
    },
    searchClear (search = this.$refs.search, timeout = 250) {
      setTimeout(() => {
        $(search).search('set value', '')
      }, timeout)
    }
  }
}
</script>
