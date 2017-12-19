<template>
  <form id="tickets_controls" class="ui form" onsubmit="event.preventDefault()">
    <div class="item" data-step="1" data-intro="Select a date range to begin. Remeber, only tickets in this range will be visible." data-position="right">
      <div class="field padding-b15">
        <label>Dates</label>
        <div class="ui input daterangepicker-container">
          <input type="text" class="ui daterangepicker" v-model="daterange">
        </div>
      </div>
    </div>
    <div class="item" data-step="2" data-intro="Search for specific tickets by id, builder, subdivision or type.">
      <div class="ui category search ticket">
        <div class="ui icon input">
          <i class="search icon"></i>
          <input class="prompt" type="text" placeholder="Search Tickets.." v-model="search" v-cloak>
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
    <div class="item">
      <button class="ui labeled blue icon button" @click="addTicketModalOpen">
        <i class="add square icon"></i>
        Add Ticket
      </button>
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
import { introJs } from 'intro.js'

// console.log("introJs",introJs);
export default {
  data () {
    return {
      meta: {
        page: 'Tickets'
      },
      search    : '',
      filtersTemplate : {
        page: 'Tickets',
        daterange : [
          moment().format('YYYY-MM-DD'),
          moment().add(30, 'days').format('YYYY-MM-DD')
        ],
        ticketId: 0,
        builderId: 0,
        subdivisionId: 0,
        houseId: 0,
      },
    }
  },
  computed: {
    daterange () {
      let dr = this.$store.state.filters.daterange
      let drstart = moment(dr[0]).format('MM/DD/YY')
      let drend = moment(dr[1]).format('MM/DD/YY')
      return drstart + ' - ' + drend
    },
    filters () { return this.$store.state.filters }
  },
  mounted: function() {

    console.log("this.filters",this.filters);
    if (!this.filters.page || this.filters.page !== this.meta.page) {
      this.$store.commit('filtersSet', this.filtersTemplate)
    }

    // $('#tickets_controls .ui.ticket.search').search({
    //   type: 'category',
    //   apiSettings: {
    //     method: 'post',
    //     url: BPC.r.tickets.search + '?q={query}',
    //   },
    //   selectFirstResult: true,
    //   onSelect: function (result, response) {
    //     this.search = '';
    //     this.filters[result.category].description = result.title;
    //     this.filters[result.category].value = result.id;
    //     BPC.tickets.update();
    //   }.bind(this),
    // });

    console.log("this.filters.daterange",this.filters.daterange);
    $('.daterangepicker').daterangepicker({
      opens: 'right',
      drops: 'down',
      format: 'MM/DD/YY',
      startDate: moment(this.filters.daterange[0]),
      endDate: moment(this.filters.daterange[1]),
      ranges: {
          'Next 30 Days': [moment(), moment().add(30, 'days'),],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      },
    }, (start, end, label) => {
      var daterange = [
        start.format('YYYY-MM-DD'),
        end.format('YYYY-MM-DD')
      ];
      this.filters.daterange = daterange
      this.$store.commit('filtersSet', this.filters)
      // this.filters.daterange = daterange;
    });
  },
  methods: {
    resetFilters: function() {
      this.filters = JSON.parse(this.filtersBlank);
    },
    filterRemove: function (event) {
      var name = $(event.target).closest('[data-filter]').data('filter');
      this.filters[name].value = 0;
      // BPC.tickets.update();
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
      // BPC.tickets.update();
    },
    walkthrough: function() {
      introJs().start();
      console.log("introJs()",introJs());
    },
    addTicketModalOpen: function () {
      console.log("this.$store.state.modal",this.$store.state.modal);
      this.$store.dispatch('modalOpen', 'TicketAddModal')
    },
  },
}

</script>