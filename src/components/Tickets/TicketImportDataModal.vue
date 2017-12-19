<template>
  <div class="ui small modal" id="import_data_modal">
    <i class="close icon"></i>
    <div class="header">Import Data</div>
    <div class="content" v-show="page == 'start'">
      <p class="padding30">Click <a href="#upload_data" @click.prevent="upload_open">Upload</a> to add parts from a bid.<br><strong>Remember</strong> the parts must be on the first worksheet.</p>
      <div hidden="">
        <input type="file" name="data" id="data_file_input" @change="upload_file">
      </div>
    </div>
    <div class="content" v-show="page == 'progress'">
      <div class="ui progress" id="file_progress_bar">
        <div class="bar"></div>
        <label>Uploading File</label>
      </div>
    </div>
    <div class="content" v-show="page == 'complete'">
      <p class="padding30">File has been uploaded!</p>
    </div>
    <div class="padding30" v-show="page == 'start'">
      <div class="ui black button" @click="close">Exit</div>
      <div class="ui green icon button right floated" @click.prevent="upload_open">
        Upload
        <i class="checkmark icon"></i>
      </div>
    </div>
    <div class="padding30" v-show="page == 'complete'">
      <div class="ui black button floated right" @click="close">Close</div>
    </div>
  </div>
</template>

<script>
import SocketIOFileClient from 'socket.io-file-client'

export default {
  data () {
    return {
      ticket: {},
      row: {},
      page: 'start',
    }
  },
  mounted: function() {
    // console.log("start", BPC.s.item);
    // BPC.s.item = 'thing'
    // console.log("end", BPC.s.item);
    $('#file_progress_bar').progress();
  },
  methods: {
    open: function(ticket) {
      $(this.$el).modal('show');
      this.$set('page', 'start');
      $('#data_file_input').val('');
      this.ticket = JSON.parse(JSON.stringify(ticket))
    },
    close: function() {
      $(this.$el).modal('hide');
    },
    upload_open: function () {
      $('#data_file_input').click();
    },
    upload_file: function (event) {
      // var uploader = new SocketIOFileClient(BPC.socket);
      let pb = $('#file_progress_bar')
      console.log("pb",pb);

      uploader.on('start', (fileInfo) => {
        console.log("fileInfo",fileInfo);
        console.log('Start uploading', fileInfo);
      });
      uploader.on('stream', (fileInfo) => {
        let percent = Math.round(fileInfo.sent / fileInfo.size * 100, -2)
        pb.progress('set percent', percent);
        console.log('Streaming... sent ' + fileInfo.sent + ' bytes.');
      });
      uploader.on('complete', (fileInfo) => {
        console.log('Upload Complete', fileInfo);
      });
      uploader.on('error', (err) => {
        console.log('Error!', err);
      });
      uploader.on('abort', (fileInfo) => {
        console.log('Aborted: ', fileInfo);
      });

      this.page = 'progress'

      uploader.on('ready', () => {
        var fileEl = document.getElementById('data_file_input');
        var uploadIds = uploader.upload(fileEl, { ticket_id: this.ticket.ticket_id });
        console.log("uploadIds",uploadIds);
        pb.progress('set percent', 0);
        uploader.destroy()
      })

      //     data = JSON.parse(data);
      //     BPC.tickets.import_data_modal.$set('page', 'complete');
      //     BPC.tickets.tickets_table.row(this.row).data(data.ticket);
    },
  }
}
</script>
