<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Walk Ticket</div>
    <div class="content">
      <form class="ui form">
        <button class="ui blue button" v-show="!wip.punch_id" @click.prevent="createPunch">Create Punch List</button>
      </form>
      <div v-show="wip.punch_id">
        <h5>Punch List</h5>
        <div v-for="task in tasks">
          <span>{{ task.task }}</span>
          <i class="remove circle icon" @click="taskRemove(task.task_id)"></i>
        </div>
        <form class="ui form" v-show="wip.punch_id" @submit.prevent="createTask">
          <div class="field">
            <label>New Task</label>
            <div class="one-line">
              <input type="text" v-model="taskNew" placeholder="New task..">
              <button class="ui orange button">Add</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="update">
        Walk Ticket
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
      row: {},
      wip: {},
      tasks: [],
      taskNew: '',
    }
  },
  methods: {
    afterOpen ({row, data}) {
      this.tasks = []
      this.wip = {}

      // if (this.wip.punch_id) {
      //   this.tasksGet();
      // }
    },
    update: function(event) {
      // var data = {
      //   data: this.wip,
      // };
      // $.post(BPC.routes['wip.walk'], data, function(data) {
      //   BPC.overhang(data.message, data.success, 2);
      //   if (data.success) {
      //     $(this.$el).modal('hide');
      //     BPC.wip.update();
      //   }
      // }.bind(this), 'json');
    },
    createPunch () {
      // var url = BPC.routes['tickets.create_punch'];
      // var data = {
      //   data: {
      //     ticket_id: this.wip.ticket_id,
      //   }
      // };
      // $.post(url, data, function (data) {
      //   if (data.success) {
      //     BPC.overhang(data.message, data.success);
      //     this.$set('punch_list', []);
      //     this.$set('wip.punch_id', data.punch_id);
      //   }
      //   BPC.overhang(data.message, data.success);
      // }.bind(this), 'json');
    },
    createTask () {
      // var url = BPC.routes['tickets.task_add'];
      // var data = {
      //   data: {
      //     ticket_id: this.wip.punch_id,
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
      //   ticket_id: this.wip.punch_id,
      // }
      // var url = BPC.routes['tickets.tasks_get'];
      // $.post(url, data, function (data) {
      //   this.$set('tasks', data.tasks);
      // }.bind(this), 'json');
    },
    deleteTask (task_id) {
      // console.log("task_id",task_id);
      // var data = {
      //   task_id: task_id,
      // }
      // var url = BPC.routes['tickets.task_remove'];
      // $.post(url, data, function (data) {
      //   this.tasksGet();
      // }.bind(this), 'json');
    }
  },
}
</script>
