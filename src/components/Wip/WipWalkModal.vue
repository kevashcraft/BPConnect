<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Walk {{ ticket.subdivisionName }} - {{ ticket.houseLot }}</div>
    <div class="content">
      <div class="ui icon message">
        <i class="check circle yellow icon"></i>
        <div class="content">
          <div class="header">Confirm Parts & Tasks</div>
          <p>Confirm the parts have been installed and the tasks completed.</p>
        </div>
      </div>
      <form class="ui form padding30" v-show="ticket.parts.length" ref="parts">
        <div class="ui dividing header">Parts</div>
        <div v-for="part in ticket.parts" class="padding5">
          <div class="ui slider checkbox part">
            <input type="checkbox" v-model="part.walked">
            <label>{{ part.description }}</label>
          </div>
        </div>
        <div><button class="ui button" @click.prevent="partsToggle">Toggle All Parts</button></div>
      </form>
      <form class="ui form padding30" v-show="ticket.tasks.length" ref="tasks">
        <div class="ui dividing header">Tasks</div>
        <div v-for="task, index in ticket.tasks" class="padding5" v-show="!task.deleted">
          <div class="ui slider task" :class="{checkbox : !task.new}">
            <input type="checkbox" v-model="task.walked" v-show="!task.new">
            <label>
              {{ task.task }}
              <button class="ui icon button" @click.prevent="taskRemove(index)" v-show="task.new">
                <i class="delete icon"></i>
              </button>
            </label>
          </div>
        </div>
        <div><button class="ui button" @click.prevent="tasksToggle">Toggle All Tasks</button></div>
      </form>
      <form class="ui form padding30" ref="newtask">
        <div class="ui dividing header">Add a New Task</div>
        <div class="field">
          <label>Task</label>
          <input type="text" v-model="newtask" placeholder="New Task">
        </div>
        <button @click.prevent="newtaskAdd" class="ui button">Add</button>
      </form>
    </div>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="update" v-show="isComplete">
        Ticket is Complete
        <i class="thumbs up icon"></i>
      </div>
      <div class="ui red icon button" @click="createPunch" v-show="!isComplete">
        Create Punch
        <i class="thumbs up icon"></i>
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
        name: 'WipWalkModal'
      },
      ticket: {
        parts: [],
        tasks: []
      },
      newtask: '',
    }
  },
  computed: {
    isComplete () {
      let partsComplete = this.ticket.parts.every(part => { return part.walked })
      let tasksComplete = this.ticket.tasks.every(task => { return task.walked || task.deleted })
      return partsComplete && tasksComplete
    }
  },
  methods: {
    afterOpen (ticket) {
      ticket.parts = []
      ticket.tasks = []
      this.ticket = ticket
      this.retrieve()
    },
    retrieve () {
      this.$root.req('TicketsExt:retrieveParts', this.ticket).then((response) => {
        this.$set(this.ticket, 'parts', response)
        setTimeout(() => {
          $('.ui.checkbox').checkbox()
        },100)
      })
      this.$root.req('TicketsExt:retrieveTasks', this.ticket).then((response) => {
        this.$set(this.ticket, 'tasks', response)
        setTimeout(() => {
          $('.ui.checkbox').checkbox()
        },100)
      })
    },
    update (event) {
      this.$root.req('Wip:updateWalked', this.ticket).then((response) => {
        if (response) {
          this.$root.noty('Ticket work has been confirmed')
          this.$emit('update')
          this.close()
        } else {
          this.$root.noty('Could not confirm ticket work', 'error')
        }
      })
    },
    partsToggle () {
      let value = this.ticket.parts.some(part => {return part.walked}) ? 'uncheck' : 'check'
      $(this.$refs.parts).find('.ui.checkbox').checkbox(value)
    },
    tasksToggle () {
      let value = this.ticket.tasks.some(task => {return task.walked}) ? 'uncheck' : 'check'
      $(this.$refs.tasks).find('.ui.checkbox').checkbox(value)
    },
    newtaskAdd () {
      let task = {
        ticketId: this.ticket.ticketId,
        task: this.newtask,
        new: true
      }
      this.ticket.tasks.push(task)
      this.newtask = ''
      this.refresh()
    },
    taskRemove (index) {
      this.ticket.tasks[index].deleted = true
      this.ticket.tasks.splice(index, 1, this.ticket.tasks[index])
    },
    createPunch () {
      this.$root.req('TicketsExt:createPunch', this.ticket).then((response) => {
        if (response) {
          this.$root.noty('Punch list has been created')
          this.$emit('update')
          this.close()
        } else {
          this.$root.noty('Could not create punch list', 'error')
        }
      })
    }
  },
}
</script>
