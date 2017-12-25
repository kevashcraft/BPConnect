<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Update Workers</div>
    <div class="content">
      <div>
        <strong>Workers</strong>
        <div v-for="worker in ticket.workers">
          <span>{{ worker.type }}</span>
          <span>{{ worker.name }}</span>
        </div>
      </div>
      <form class="ui form padding30">
        <div class="fluid field">
          <div class="ui search" ref="search">
            <label>Find a Worker</label>
            <input type="text" class="prompt" v-model="search">
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
      ticket: {},
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
    afterOpen (data) {
      this.ticket = JSON.parse(JSON.stringify(data))

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
        $(search).search('set value', ' ')
      }, timeout)
    }
  }
}
</script>
