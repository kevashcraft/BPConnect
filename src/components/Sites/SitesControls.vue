<tempate>
  <div id="sites_controls">
    <div class="item">
      <div class="ui sites category search">
        <div class="ui icon fluid input">
          <input class="prompt" type="text" placeholder="Search Sites.." v-model="search">
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
</tempate>

<script>
export default {
  data () {
    return {
      daterange : [],
      filters   : {
        ticket_id      : 0,
        subdivision_id : 0,
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
      this.daterange = daterange;
      if (BPC.isLocalStorageAvailable) {
        localStorage.setItem('daterange', JSON.stringify(daterange));
      }
      BPC.sites.update();
    }.bind(this));

    $('.ui.sites.search').search({
      type: 'category',
      apiSettings: {
        method: 'post',
        url: BPC.r.sites.search + '?q={query}',
      },
      selectFirstResult: true,
      onSelect: function (result, response) {
        this.resetFilters();
        switch (result.category) {
          case 'Permits':
            this.filters.site_id = result.id;
            break;
          case 'Tickets':
            this.filters.ticket_id = result.id;
            break;
          case 'Inspectors':
            this.filters.inspector_id = result.id;
            break;
        }
        BPC.site.update();
      }.bind(this),
    });
  },
  methods: {
    resetFilters: function() {
      this.filters = {
        ticket_id      : 0,
        subdivision_id : 0,
        house_id       : 0,
      };
    },
    clear: function() {
      this.$set('search', '');
      this.resetFilters();
      BPC.sites.update();
    },
  },
}
</script>