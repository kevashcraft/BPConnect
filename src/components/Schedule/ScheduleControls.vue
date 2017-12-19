<template>
  <form id="schedule_controls" class="ui form" onsubmit="event.preventDefault()">
    <div class="item" data-step="1" data-intro="Select a date range to begin. Remeber, only tickets in this range will be visible." data-position="right">
      <div class="field padding-b15">
        <label>Dates</label>
        <div class="ui input daterangepicker-container">
          <input type="text" class="ui daterangepicker" v-model="dr_string">
        </div>
      </div>
    </div>
    <div class="item" data-step="2" data-intro="Search for specific schedule by id, builder, subdivision or type.">
      <div class="ui category search ticket">
        <div class="ui icon input">
          <i class="search icon"></i>
          <input class="prompt" type="text" :placeholder="page.title" v-model="search" v-cloak>
        </div>
        <div class="results"></div>
      </div>
      <div>
        {% verbatim %}
        <div class="pointer" v-for="filter in filters" v-show="filter.value !== 0" @click="filterRemove" :data-filter="filter.category">
          <i class="remove circle icon"></i>
          <span>{{ filter.name }}</span>
          <span>{{ filter.description }}</span>
        </div>
        {% endverbatim %}
      </div>
      <div>
        <a href="#clear" v-show="search.length > 0" @click="clear_search">Clear</a>
      </div>
    </div>
    <div class="item" data-step="3" data-intro="Select which columns you want to see and which you don't.">
      <button class="ui blue button" onclick="BPC.columns_modal.open(event)">Configure Columns</button>
    </div>
    <div class="item">
      <button class="ui labeled blue icon button" @click="walkthrough">
        <i class="street view icon"></i>
        Walkthrough
      </button>
    </div>
  </form>
</template>

<script>
export default {
  data () {
    return {

      search    : '',
      daterange : [],
      dr_string : '',
      filters   : {
        'Tickets'      : {
          value: 0,
          slug: 'ticket_id',
          category: 'Tickets',
          name: 'Ticket',
          description: '',
        },
        'Builders'     : {
          value: 0,
          slug: 'builder_id',
          category: 'Builders',
          name: 'Builder',
          description: '',
        },
        'Subdivisions' : {
          value: 0,
          slug: 'subdivision_id',
          category: 'Subdivisions',
          name: 'Subdivision',
          description: '',
        },
        'Lots'       : {
          value: 0,
          slug: 'house_id',
          category: 'Lots',
          name: 'Lot',
          description: '',
        },
        'Plumbers'       : {
          value: 0,
          slug: 'plumber_id',
          category: 'Plumbers',
          name: 'Plumber',
          description: '',
        },
        'Helpers'       : {
          value: 0,
          slug: 'helper_id',
          category: 'Helpers',
          name: 'Helper',
          description: '',
        },
      },
    }
  },
  mounted: function() {
    this.filtersBlank = JSON.stringify(this.filters);
    $('#schedule_controls .ui.ticket.search').search({
      type: 'category',
      apiSettings: {
        method: 'post',
        url: BPC.r.schedule.search + '?q={query}',
      },
      selectFirstResult: true,
      onSelect: function (result, response) {
        this.search = '';
        console.log("this.filters",this.filters);
        console.log("result.category",result.category);
        this.filters[result.category].description = result.title;
        this.filters[result.category].value = result.id;
        BPC.schedule.update();
      }.bind(this),
    });

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
      BPC.schedule.update();
    }.bind(this));
  },
  methods: {
    resetFilters: function() {
      this.filters = JSON.parse(this.filtersBlank);
    },
    filterRemove: function (event) {
      var name = $(event.target).closest('[data-filter]').data('filter');
      this.filters[name].value = 0;
      BPC.schedule.update();
    },
    filtersValues: function () {
      var filters = {};
      Object.keys(this.filters).forEach(function(key) {
        var filter = this.filters[key];
        filters[filter.slug] = filter.value;
      }.bind(this));
      return filters;
    },
    clear_search: function() {
      this.$set('search', '');
      this.resetFilters();
      BPC.schedule.update();
    },
    walkthrough: function() {
      introJs().start();
    },
    add_ticket_modal_open: function () {
      BPC.add_ticket_modal.open();
    },
  },
}

</script>