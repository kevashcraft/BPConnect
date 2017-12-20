<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Update Workers</div>
    <div class="content">
      <div>
        <strong>Workers</strong>
        <div v-for="worker in workers">
          <span>{{ worker.type }}</span>
          <span>{{ worker.name }}</span>
        </div>
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

    // $('#schedule_update_workers_modal .ui.search').search({
    //   type: 'category',
    //   apiSettings: {
    //     url: BPC.r.schedule.workers_search + '?query={query}',
    //     method: 'post'
    //   },
    //   selectFirstResult: true,
    //   onSelect: function (result, response) {
    //     var worker = {
    //       type: result.type,
    //       id: result.id,
    //       name: result.title
    //     };
    //     if (result.type === 'plumber' && this.workers.some(function(el) { return el.type === 'plumber'})) {
    //       $('body').overhang({
    //         type: 'confirm',
    //         message: "Do you want to replace the current plumber?",
    //         callback (replace) {
    //           if (replace) {
    //             var workers = [worker];
    //             for (var i = 0; i < this.workers.length; i++) {
    //               if (this.workers[i].type !== 'plumber') {
    //                 workers.push(this.workers[i]);
    //               }
    //             }
    //             this.workers = workers;
    //             $('#schedule_update_workers_modal .ui.search').search('set value', ' ');
    //           }
    //         }.bind(this),
    //       });
    //     } else {
    //       this.workers.push(worker);
    //       setTimeout(function () {
    //         $('#schedule_update_workers_modal .ui.search').search('set value', ' ');
    //       },250);
    //     }
    //   }.bind(this),
    // });
  },
  methods: {
    open (data, row) {

      this.row  = row;
      this.workers = [];
      this.ticket = JSON.parse(JSON.stringify(data));

      $('#schedule_update_workers_modal .ui.search').search('set value', '');
      $(this.$el).modal('show');

      this.list();
    },
    update () {
      // var data = {
      //   data: {
      //     ticket_id: this.ticket.ticket_id,
      //     workers: this.workers,
      //   }
      // };
      // $.post(BPC.routes['schedule.update_workers'], data, function(data) {
      //   BPC.overhang(data.message, data.success, 2);
      //   if (data.success) {
      //     $(this.$el).modal('hide');
      //     BPC.schedule.schedule_table.row(this.row).data(data.ticket);
      //   }
      // }.bind(this), 'json');
    },
  }
}
</script>
