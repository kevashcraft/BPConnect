<template>
  <div class="ui small modal" id="wip_walk_modal">
    <i class="close icon"></i>
    <div class="header">Walk Ticket</div>
    <div class="content">
      <form class="ui form">
        <button class="ui blue button" v-show="!wip.punch_id" @click.prevent="punch_listCreate">Create Punch List</button>
      </form>
      {% verbatim %}
      <div v-show="wip.punch_id">
        <h5>Punch List</h5>
        <div v-for="task in tasks">
          <span>{{ task.task }}</span>
          <i class="remove circle icon" @click="taskRemove(task.task_id)"></i>
        </div>
        <form class="ui form" v-show="wip.punch_id" @submit.prevent="taskAdd">
          <div class="field">
            <label>New Task</label>
            <div class="one-line">
              <input type="text" v-model="taskNew" placeholder="New task..">
              <button class="ui orange button">Add</button>
            </div>
          </div>
        </form>
      </div>
      {% endverbatim %}
    </div>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="walk">
        Walk Ticket
        <i class="thumbs up icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      row: {},
      wip: {},
      tasks: [],
      taskNew: '',
    }
  },
  mounted: function() {

    $(this.$el).modal({
      closeable: false
    });
  },
  methods: {
    open: function(data) {
      console.log("data",data);
      this.$set('tasks', []);
      this.$set('wip', {
        ticket_id: data.ticket_id,
        punch_id : data.punch_id,
        // starts: moment().format('YYYY-MM-DD'),
      });

      if (this.wip.punch_id) {
        this.tasksGet();
      }

      $(this.$el).modal('show');
    },
    walk: function(event) {
      var data = {
        data: this.wip,
      };
      $.post(BPC.routes['wip.walk'], data, function(data) {
        BPC.overhang(data.message, data.success, 2);
        if (data.success) {
          $(this.$el).modal('hide');
          BPC.wip.update();
        }
      }.bind(this), 'json');
    },
    punch_listCreate: function () {
      var url = BPC.routes['tickets.create_punch'];
      var data = {
        data: {
          ticket_id: this.wip.ticket_id,
        }
      };
      $.post(url, data, function (data) {
        if (data.success) {
          BPC.overhang(data.message, data.success);
          this.$set('punch_list', []);
          this.$set('wip.punch_id', data.punch_id);
        }
        BPC.overhang(data.message, data.success);
      }.bind(this), 'json');
    },
    taskAdd: function () {
      var url = BPC.routes['tickets.task_add'];
      var data = {
        data: {
          ticket_id: this.wip.punch_id,
          task: this.taskNew,
        },
      };
      $.post(url, data, function (data) {
        if (data.success) {
          this.$set('taskNew', '');
          this.tasksGet();
        }
        BPC.overhang(data.message, data.success);
      }.bind(this), 'json');
    },
    tasksGet: function () {
      var data = {
        ticket_id: this.wip.punch_id,
      }
      var url = BPC.routes['tickets.tasks_get'];
      $.post(url, data, function (data) {
        this.$set('tasks', data.tasks);
      }.bind(this), 'json');
    },
    taskRemove: function (task_id) {
      console.log("task_id",task_id);
      var data = {
        task_id: task_id,
      }
      var url = BPC.routes['tickets.task_remove'];
      $.post(url, data, function (data) {
        this.tasksGet();
      }.bind(this), 'json');
    }
  },
}
</script>
