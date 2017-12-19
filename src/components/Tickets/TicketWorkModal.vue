<template>

  <div class="ui small modal" id="ticket_work_modal">
    <i class="close icon"></i>
    <div class="header">Ticket Work</div>
    <div class="content">
      <h4 class="ui dividing header">Parts</h4>
      <div>
        <div v-for="part in parts">{{ part.description }}</div>
      </div>
      <h4 class="ui dividing header">Tasks</h4>
      <div>
        <div class="task" v-for="task in tasks" :class="{show:task.show}" @click="taskShowHide" :data-task="task.id">
          <a class="link" @click="task_remove">delete</a>
          <span>{{ task.task }}</span>
        </div>
      </div>
      <div v-show="showNewTask" class="one-line">
        <form @submit.prevent="task_add">
          <div class="ui input">
            <input type="text" id="new_task" v-model="newTask" placeholder="New task..">
          </div>
          <div class="ui orange button" @click="task_add">Add</div>
        </form>
      </div>
      <div v-show="!showNewTask">
        <a class="link" @click="showNewTaskToggle">Add new task</a>
      </div>
    </div>
    <div class="actions">
      <div class="ui black button floated right" @click="close">Close</div>
    </div>
  </div>
</template>

<style type="text/css">
#ticket_work_modal .task a {
  display: none;
}
#ticket_work_modal .task.show a {
  display: inline-block;
}
</style>

<script>
export default {
  data () {
    return {
      ticket_id: 0,
      parts: [],
      tasks: [],
      newTask: '',
      showNewTask: false,
    }
  },
  methods: {
    open (ticket_id) {
      this.ticket_id = ticket_id;
      this.parts = [];
      this.tasks = [];
      this.showNewTask = false;
      this.newTask = '';
      this.getter();
      $(this.$el).modal('show');
      setTimeout(function () {
        $(this.$el).modal('refresh');
      }.bind(this), 250);
      setTimeout(function () {
        $(this.$el).modal('refresh');
      }.bind(this), 1250);
    },
    close () {
      $(this.$el).modal('hide');
    },
    getter (event) {
      var data = {
        ticket_id: this.ticket_id,
      };
      $.post(BPC.routes['tickets.ticket_work'], data, function (data) {
        this.parts = data.parts;

        var tasks = data.tasks;
        for (var i = 0; i < tasks.length; i++) {
          tasks[i].show = false;
        }
        this.tasks = tasks;
      }.bind(this), 'json');

    },
    task_add () {
      var data = {
        data: {
          ticket_id: this.ticket_id,
          task: this.newTask,
        },
      };

      $.post(BPC.routes['tickets.task_add'], data, function (data) {
        if (data.success) {
          this.newTask = '';
          this.showNewTask = false;
          this.getter();
        } else {
          BPC.overhang(data.message);
        }
      }.bind(this), 'json');
    },
    taskShowHide (event) {
      $(event.target).closest('.task').addClass('show');
    },
    task_remove (event) {
      var task_id = $(event.target).closest('[data-task]').data('task');
      var data = {
        task_id: task_id,
      };

      $.post(BPC.routes['tickets.task_remove'], data, function (data) {
        if (data.success) {
          this.getter();
        } else {
          BPC.overhang(data.message);
        }
      }.bind(this), 'json');
    },
    showNewTaskToggle (event) {
      this.showNewTask = !this.showNewTask;
      setTimeout(function () {
        $('#new_task').focus();
      }, 250);
    },
  },
}
</script>
