<template>
  <div class="ui tiny modal">
    <i class="close icon"></i>
    <div class="header">Site Ready</div>
    <div class="content">
      <div class="ui icon message">
        <i class="home icon"></i>
        <div class="content">
          <div class="header">Is the Site Ready?</div>
          <p>Select if the site is ready or a reason why it's not.</p>
        </div>
      </div>
      <form class="ui form padding30">
        <div class="field" style="text-align: center">
          <div class="ui slider checkbox">
            <label>The Site is <span style="color: red" v-show="!site.ready">not</span> Ready</label>
            <input type="checkbox" v-model="site.ready">
          </div>
        </div>
        <div class="two fields">
          <div class="field" v-show="!site.ready">
            <label>Search Reasons not Ready</label>
            <div ref="search" class="ui search">
              <div class="ui left icon input">
                <i class="bars icon"></i>
                <input type="text" class="prompt" placeholder="Reason not ready">
              </div>
            </div>
          </div>
          <div class="field relative" v-show="!site.ready">
            <div class="ui labeled icon button bottom" @click="reasonAddModal"><i class="plus icon"></i>Add New Reason</div>
          </div>
        </div>
      </form>
    </div>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="update">
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
        page: 'Src',
        name: 'SrcUpdateModal'
      },
      row: {},
      site: {},
    }
  },
  mounted () {

    $(this.$el).find('.ui.checkbox').checkbox()
    $(this.$refs.search).search({
      apiSettings: {
        responseAsync: (settings, callback) => {
          let route = 'Reasons:search'
          let data = { query: settings.urlData.query }
          this.$root.req(route, data).then(callback)
        }
      },
      selectFirstResult: true,
      onSelect: (result, response) => {
        this.site.reasonId = result.id
      },
    })
  },
  methods: {
    afterOpen (info) {
      this.row  = info.row
      this.site = {
        ticketId: info.data.ticketId,
        reasonId: null,
        ready: true,
      }

      $(this.$refs.search).search('set value', '')
    },
    update: function(event) {
      if (!this.site.ready && !this.site.reasonId) {
        this.$root.noty('Please add a reason', 'warning')
      }

      this.$root.req('Src:update', this.site).then((response) => {
        if (response) {
          this.$root.noty('Site has been updated')
          this.$emit('update')
          this.close()
        } else {
          this.$root.noty('Could not update site', 'error')
        }
      })
    },
    reasonAddModal: function () {
      this.$store.dispatch('modalSave', 'SrcReasonAddModal')
    },
  }
}
</script>
