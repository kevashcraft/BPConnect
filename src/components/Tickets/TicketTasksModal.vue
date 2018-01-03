<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Ticket Tasks - {{ ticket.subdivisionName }}: {{ ticket.houseLot }} - {{ ticket.ticketType }}</div>
    <div class="content">
      <div class="ui icon message">
        <i class="check circle yellow icon"></i>
        <div class="content">
          <div class="header">Add/Remove Tasks</div>
          <p>Add new tasks or remove old ones.</p>
        </div>
      </div>
      <div class="ui list padding30">
        <div class="ui dividing header">Ticket Tasks</div>
        <div v-show="!ticket.tasks.length">This ticket has no tasks</div>
        <div v-for="task, index in ticket.tasks" class="item" v-show="!task.deleted">
          <i class="plus icon"></i>
          <div class="header">
            <span>{{ task.task }}
              <button class="ui icon button" @click.prevent="taskRemove(index)">
                <i class="delete icon"></i>
              </button>
            </span>
          </div>
        </div>
      </div>
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
      <div class="ui green icon button" @click="update">
        Update Ticket
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
        name: 'TicketTasksModal'
      },
      ticket: {
        tasks: []
      },
      newtask: '',
    }
  },
  methods: {
    afterOpen (ticket) {
      ticket.tasks = []
      this.ticket = ticket
      this.retrieve()
    },
    retrieve () {
      this.$root.req('TicketsExt:retrieveTasks', this.ticket).then((response) => {
        this.$set(this.ticket, 'tasks', response)
        console.log('response', response)
      })
    },
    update (event) {
      let toDelete = this.ticket.tasks.filter(task => { return task.deleted && !task.new })
      let toCreate = this.ticket.tasks.filter(task => { return task.new && !task.deleted })
      let awaiting = toDelete.length + toCreate.length

      let completed = () => {
        this.$root.noty('Ticket tasks have been updated')
        this.$emit('update')
        this.close()
      }

      if (awaiting) {
        toDelete.forEach(task => {
          this.$root.req('TicketsExt:deleteTask', task).then((response) => {
            if (--awaiting === 0) completed()
          })
        })

        toCreate.forEach(task => {
          this.$root.req('TicketsExt:createTask', task).then((response) => {
            if (--awaiting === 0) completed()
          })
        })
      } else {
        completed()
      }

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
    partsToggle () {
      let value = this.ticket.parts.some(part => {return part.walked}) ? 'uncheck' : 'check'
      $(this.$refs.parts).find('.ui.checkbox').checkbox(value)
    },
    tasksToggle () {
      let value = this.ticket.tasks.some(task => {return task.walked}) ? 'uncheck' : 'check'
      $(this.$refs.tasks).find('.ui.checkbox').checkbox(value)
    },
    createPunch () {
      // var url = BPC.routes['tickets.createPunch'];
      // var data = {
      //   data: {
      //     ticketId: this.wip.ticketId,
      //   }
      // };
      // $.post(url, data, function (data) {
      //   if (data.success) {
      //     BPC.overhang(data.message, data.success);
      //     this.$set('punchList', []);
      //     this.$set('wip.punchId', data.punchId);
      //   }
      //   BPC.overhang(data.message, data.success);
      // }.bind(this), 'json');
    },
    createTask () {
      // var url = BPC.routes['tickets.taskAdd'];
      // var data = {
      //   data: {
      //     ticketId: this.wip.punchId,
      //     task: this.taskNew,
      //   },
      // };
      // $.post(url, data, function (data) {
      //   if (data.success) {
      //     this.$set('taskNew', '');
      //     this.tasksGet();
      //   }
      //   BPC.overhang(data.message, data.success);
      // }.bind(this), 'json');
    },
    listTasks () {
      // var data = {
      //   ticketId: this.wip.punchId,
      // }
      // var url = BPC.routes['tickets.tasksGet'];
      // $.post(url, data, function (data) {
      //   this.$set('tasks', data.tasks);
      // }.bind(this), 'json');
    },
    deleteTask (taskId) {
      // console.log("taskId",taskId);
      // var data = {
      //   taskId: taskId,
      // }
      // var url = BPC.routes['tickets.taskRemove'];
      // $.post(url, data, function (data) {
      //   this.tasksGet();
      // }.bind(this), 'json');
    }
  },
}
</script>
