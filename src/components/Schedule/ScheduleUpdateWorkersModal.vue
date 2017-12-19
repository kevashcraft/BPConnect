<template>

  <div class="ui small modal" id="schedule_update_workers_modal">
    <i class="close icon"></i>
    <div class="header">Update Workers</div>
    <div class="content">
      <div>
        <strong>Workers</strong>
        {% verbatim %}
        <div v-for="worker in workers">
          <span>{{ worker.type }}</span>
          <span>{{ worker.name }}</span>
        </div>
        {% endverbatim %}
      </div>
      <form class="ui form padding30">
        <div class="fluid field">
          <div class="ui search">
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
export default {
    data () {
      return {
        row: {},
        ticket: {},
        workers: [],
      }
    },
    mounted: function() {

      $('#schedule_update_workers_modal .ui.checkbox').checkbox();
      $(this.$el).modal({closable: false});

      $('#schedule_update_workers_modal .ui.search').search({
        type: 'category',
        apiSettings: {
          url: BPC.r.schedule.workers_search + '?query={query}',
          method: 'post'
        },
        selectFirstResult: true,
        onSelect: function (result, response) {
          var worker = {
            type: result.type,
            id: result.id,
            name: result.title
          };
          if (result.type === 'plumber' && this.workers.some(function(el) { return el.type === 'plumber'})) {
            $('body').overhang({
              type: 'confirm',
              message: "Do you want to replace the current plumber?",
              callback: function(replace) {
                if (replace) {
                  var workers = [worker];
                  for (var i = 0; i < this.workers.length; i++) {
                    if (this.workers[i].type !== 'plumber') {
                      workers.push(this.workers[i]);
                    }
                  }
                  this.workers = workers;
                  $('#schedule_update_workers_modal .ui.search').search('set value', ' ');
                }
              }.bind(this),
            });
          } else {
            this.workers.push(worker);
            setTimeout(function () {
              $('#schedule_update_workers_modal .ui.search').search('set value', ' ');
            },250);
          }
        }.bind(this),
      });
    },
    methods: {
      open: function(data, row) {

        this.row  = row;
        this.workers = [];
        this.ticket = JSON.parse(JSON.stringify(data));

        $('#schedule_update_workers_modal .ui.search').search('set value', '');
        $(this.$el).modal('show');

        this.getWorkers();
      },
      update: function(event) {
        var data = {
          data: {
            ticket_id: this.ticket.ticket_id,
            workers: this.workers,
          }
        };
        $.post(BPC.routes['schedule.update_workers'], data, function(data) {
          BPC.overhang(data.message, data.success, 2);
          if (data.success) {
            $(this.$el).modal('hide');
            BPC.schedule.schedule_table.row(this.row).data(data.ticket);
          }
        }.bind(this), 'json');
      },
      getWorkers: function () {
        var url = BPC.routes['schedule.get_workers'];
        var data = { ticket_id: this.ticket.ticket_id };
        $.post(url, data, function (data) {
          this.workers = data.workers;
        }.bind(this), 'json');
      }
    }
  }
</script>
