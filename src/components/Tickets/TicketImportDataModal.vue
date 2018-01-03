<template>
  <div class="ui small modal" id="importDataModal">
    <i class="close icon"></i>
    <div class="header">Import Data</div>
    <div class="content" v-show="page == 'start'">
      <p class="padding30">Click <a href="#uploadData" @click.prevent="uploadOpen">Upload</a> to add parts from a bid.<br><strong>Remember</strong> the parts must be on the first worksheet.</p>
      <div hidden="">
        <input type="file" name="data" id="dataFileInput" @change="uploadFile">
      </div>
    </div>
    <div class="content" v-show="page == 'progress'">
      <div class="ui progress" id="fileProgressBar">
        <div class="bar"></div>
        <label>Uploading File</label>
      </div>
      <div>
        <a @click="again">DO IT AGAIN!</a>
      </div>
    </div>
    <div class="content" v-show="page == 'complete'">
      <p class="padding30">File has been uploaded!</p>
    </div>
    <div class="padding30" v-show="page == 'start'">
      <div class="ui black button" @click="close">Exit</div>
      <div class="ui green icon button right floated" @click.prevent="uploadOpen">
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
import Modal from '../Modal/Modal'
import SocketIOFileClient from 'socket.io-file-client'

export default {
  data () {
    return {
      meta: {
        name: 'TicketImportDataModal'
      },
      ticket: {},
      row: {},
      page: 'start',
    }
  },
  mixins: [ Modal ],
  mounted: function() {
    $('#fileProgressBar').progress();
  },
  methods: {
    afterOpen: function({row, data}) {
      this.page = 'start'
      $('#dataFileInput').val('');
      this.ticket = JSON.parse(JSON.stringify(data))
      this.uploadOpen()
    },
    uploadOpen: function () {
      $('#dataFileInput').click();
    },
    again () {
      this.uploadFile()
    },
    uploadFile: function (event) {
      let uploader = new SocketIOFileClient(this.$root.socket);
      let pb = $('#fileProgressBar')
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
        uploader.destroy()
        this.$emit('update')
        this.close()
      });
      uploader.on('error', (err) => {
        console.log('Error!', err);
      });
      uploader.on('abort', (fileInfo) => {
        console.log('Aborted: ', fileInfo);
      });

      this.page = 'progress'

      uploader.on('ready', () => {
        var fileEl = document.getElementById('dataFileInput');
        var uploadIds = uploader.upload(fileEl, {
          data: {
            route: 'TicketsExt:dataImport',
            ticketId: this.ticket.ticketId
          }
        });

        pb.progress('set percent', 0);
      })

      //     data = JSON.parse(data);
      //     BPC.tickets.importDataModal.$set('page', 'complete');
      //     BPC.tickets.ticketsTable.row(this.row).data(data.ticket);
    },
  }
}
</script>
