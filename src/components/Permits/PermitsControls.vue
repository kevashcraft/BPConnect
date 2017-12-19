<template>
  <div id="permits_controls">
    <div class="item">
      <div class="ui permits category search">
        <div class="ui icon fluid input">
          <input class="prompt" type="text" :placeholder="page.title" v-model="search">
          <i class="search icon"></i>
        </div>
        <div class="results"></div>
      </div>
      <div>
        <a href="#clear" @click="clear" v-show="search.length > 0">Clear</a>
      </div>
    </div>
    <div class="item">
      <div class="ui input">
        <label>Dates</label>
        <input type="text" class="ui daterangepicker">
      </div>
    </div>
    <div class="item">
      <button class="ui blue button" onclick="BPC.columns_modal.open()">Configure Columns</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search    : '',
      daterange : [],
      filters   : {
        permit_id      : 0,
        inspector_id   : 0,
        ticket_id      : 0,
        house_id       : 0,
      },
    }
  },
  mounted: function() {
    $('.daterangepicker').daterangepicker({
      opens: 'right',
      drops: 'down',
      format: 'MM/DD/YY',
      ranges: {
          'Today': [moment(), moment()],
          'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
          'Last Year': [moment().subtract(1, 'year').startOf('month'), moment()]
      },
    }, function(start, end, label) {
      var daterange = [
        start.format('YYYY-MM-DD'),
        end.format('YYYY-MM-DD')
      ];
      BPC.permits_controls.$set('daterange', daterange);
      if (BPC.isLocalStorageAvailable) {
        localStorage.setItem('daterange', JSON.stringify(daterange));
      }
      BPC.permits.update();
    }.bind(this));

    $('.ui.permits.search').search({
      type: 'category',
      apiSettings: {
        method: 'post',
        url: BPC.r.permits.search + '?q={query}',
      },
      selectFirstResult: true,
      onSelect: function (result, response) {
        this.resetFilters();
        switch (result.category) {
          case 'Permits':
            this.filters.permit_id = result.id;
            break;
          case 'Tickets':
            this.filters.ticket_id = result.id;
            break;
          case 'Inspectors':
            this.filters.inspector_id = result.id;
            break;
        }
        BPC.permits.update();
      }.bind(this),
    });
  },
  methods: {
    resetFilters: function() {
      this.filters = {
        permit_id    : 0,
        inspector_id : 0,
        ticket_id    : 0,
        house_id     : 0,
      };
    },
    clear: function() {
      this.$set('search', '');
      this.resetFilters();
      BPC.permits.update();
    },
  },
}

</script>
