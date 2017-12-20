<template>
  <form id="tickets_controls" class="ui form" onsubmit="event.preventDefault()">
    <div class="item" data-step="1" data-intro="Select a date range to begin. Remeber, only tickets in this range will be visible." data-position="right">
      <div class="field padding-b15">
        <label>Dates</label>
        <div class="ui input daterangepicker-container">
          <input type="text" class="ui daterangepicker" v-model="drString">
        </div>
      </div>
    </div>
    <div class="item" data-step="2" data-intro="Search for specific tickets by id, builder, subdivision or type.">
      <div class="ui category search ticket">
        <div class="ui icon input">
          <i class="search icon"></i>
          <input class="prompt" type="text" :placeholder="searchPlaceholder" v-model="search" v-cloak>
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
import Controls from '../Controls/Controls'

export default {
  mixins: [ Controls ],
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
  mounted () {

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
    addTicketModalOpen: function () {
      console.log("this.$store.state.modal",this.$store.state.modal);
      this.$store.dispatch('modalOpen', 'TicketAddModal')
    },
  },
}

</script>