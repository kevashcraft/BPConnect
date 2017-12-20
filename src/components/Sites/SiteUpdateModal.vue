<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Update Site</div>
    <form class="ui form padding30">
      <div class="field fluid">
        <div class="ui slider checkbox">
          <label>Site <span v-show="!site.ready">not</span> ready</label>
          <input type="checkbox" v-model="site.ready">
        </div>
      </div>
      <div class="two fields">
        <div class="field" v-show="!site.ready">
          <div class="ui search">
            <label>Reason not Ready</label>
            <input type="text" class="prompt">
          </div>
        </div>
        <div class="field" v-show="!site.ready">
          <div class="ui button" @click="reasonAddModal">Add</div>
        </div>
      </div>
    </form>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="submit">
        Update Site
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
        page: 'Sites',
        name: 'SiteUpdateModal'
      },
      row: {},
      site: {},
    }
  },
  mounted () {

    $('#siteUpdateModal .ui.checkbox').checkbox()
    // $('#siteUpdateModal .ui.search').search({
    //   apiSettings: {
    //     url: BPC.r.sites.reasonsSearch + '?query={query}',
    //     method: 'post'
    //   },
    //   selectFirstResult: true,
    //   onSelect: function (result, response) {
    //     this.site.reasonId = result.id
    //   }.bind(this),
    // })
  },
  methods: {
    afterOpen (info) {
      this.row  = info.row
      this.site = {
        ticketId: info.data.ticketId,
        reasonId: null,
        ready    : false,
      }

      $('#siteUpdateModal .ui.search').search('set value', '')
    },
    submit: function(event) {
      // if (!this.site.ready && !this.site.reasonId) BPC.overhang('Please add a reason', false)

      // var data = {
      //   site: this.site,
      // }
      // $.post(BPC.r.sites.update, data, function(data) {
      //   BPC.overhang(data.message, data.success, 2)
      //   if (data.success) {
      //     $(this.$el).modal('hide')
      //     BPC.sites.sitesTable.row(this.row).data(data.site)
      //   }
      // }.bind(this), 'json')
    },
    reasonAddModal: function () {
      // BPC.sites.reasonAddModal.open()
    },
  }
}
</script>
