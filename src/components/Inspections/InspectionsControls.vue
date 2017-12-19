<template>
  <form id="inspections_controls" class="ui form" onsubmit="event.preventDefault()">
    <div class="item" data-step="1" data-intro="Select a date range to begin. Remeber, only inspections in this range will be visible." data-position="right">
      <div class="field padding-b15">
        <label>Dates</label>
        <div class="ui input daterangepicker-container">
          <input type="text" class="ui daterangepicker" v-model="dr_string">
        </div>
      </div>
    </div>
    <div class="item" data-step="2" data-intro="Search for specific inspections by id, builder, subdivision or type.">
      <div class="ui category search ticket">
        <div class="ui icon input">
          <i class="search icon"></i>
          <input class="prompt" type="text" placeholder="page.title" v-model="search" v-cloak>
        </div>
        <div class="results"></div>
      </div>
      <div>
        <div class="pointer" v-for="filter in filters" v-show="filter.value !== 0" @click="filterRemove" :data-filter="filter.category">
          <i class="remove circle icon"></i>
          <span>{{ filter.name }}</span>
          <span>{{ filter.description }}</span>
        </div>
      </div>
      <div>
        <a href="#clear" v-show="search.length > 0" @click="clear_search">Clear</a>
      </div>
    </div>
    <div class="item" data-step="3" data-intro="Select which columns you want to see and which you don't.">
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
import moment from 'moment'

export default {
  data() {
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
        'Permits'     : {
          value: 0,
          slug: 'permit_id',
          category: 'Permits',
          name: 'Permits',
          description: '',
        },
        'Inspections' : {
          value: 0,
          slug: 'inspection_id',
          category: 'Inspections',
          name: 'Inspection',
          description: '',
        },
        'Inspectors' : {
          value: 0,
          slug: 'inspector_id',
          category: 'Inspectors',
          name: 'Inspector',
          description: '',
        },
        'Houses' : {
          value: 0,
          slug: 'house_id',
          category: 'Houses',
          name: 'House',
          description: '',
        },
      },
    }
  },
  mounted: function() {
    this.filtersBlank = JSON.stringify(this.filters);
    // $('#inspections_controls .ui.ticket.search').search({
    //   type: 'category',
    //   apiSettings: {
    //     method: 'post',
    //     url: BPC.routes['inspections.search'] + '?q={query}',
    //   },
    //   selectFirstResult: true,
    //   onSelect: function (result, response) {
    //     this.search = '';
    //     this.filters[result.category].description = result.title;
    //     this.filters[result.category].value = result.id;
    //     BPC.inspections.update();
    //   }.bind(this),
    // });

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
      BPC.inspections.update();
    }.bind(this));
  },
  methods: {
    resetFilters: function() {
      this.filters = JSON.parse(this.filtersBlank);
    },
    filterRemove: function (event) {
      var name = $(event.target).closest('[data-filter]').data('filter');
      this.filters[name].value = 0;
      BPC.inspections.update();
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
      BPC.inspections.update();
    },
    walkthrough: function() {
      introJs().start();
    },
  },
}
</script>