<template>
  <form class="ui form" onsubmit="event.preventDefault()">
    <div class="item" data-step="1" data-intro="Select a date range to begin. Remeber, only permits in this range will be visible." data-position="right">
      <div class="field padding-b15">
        <label>Dates</label>
        <div class="ui input daterangepicker-container">
          <input type="text" class="ui daterangepicker" v-model="drString">
        </div>
      </div>
    </div>
    <div class="item" data-step="2" data-intro="Search for specific permits by id, builder, subdivision or type.">
      <div class="ui category search ticket">
        <div class="ui icon input">
          <i class="search icon"></i>
          <input class="prompt" type="text" :placeholder="searchPlaceholder" v-model="search" v-cloak>
        </div>
        <div class="results"></div>
      </div>
<!--       <div>
        <div class="pointer" v-for="filter in filters" v-show="filter.value !== 0" @click="filterRemove" :data-filter="filter.category">
          <i class="remove circle icon"></i>
          <span>{{ filter.name }}</span>
          <span>{{ filter.description }}</span>
        </div>
      </div> -->
<!--       <div>
        <a href="#clear" v-show="search.length > 0" @click="clearSearch">Clear</a>
      </div> -->
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
        name: 'WipControls',
      },
    }
  },
  mounted () {

    // $('.ui.wip.search').search({
    //   type: 'category',
    //   apiSettings: {
    //     method: 'post',
    //     url: BPC.routes['wip.search'] + '?q={query}',
    //   },
    //   selectFirstResult: true,
    //   onSelect: function (result, response) {
    //     this.resetFilters();
    //     switch (result.category) {
    //       case 'Tickets':
    //         this.filters.ticketId = result.ticketId;
    //         break;
    //     }
    //     BPC.wip.update();
    //   }.bind(this),
    // });
  },
  methods: {
    resetFilters () {
      this.filters = {
        permitId    : 0,
        inspectorId : 0,
        ticketId    : 0,
        houseId     : 0,
      };
    },
    clear () {
      this.$set('search', '');
      this.resetFilters();
      // BPC.wip.update();
    },
  },
}
</script>
