<template>
  <form class="ui form" onsubmit="event.preventDefault()">
    <div class="item" data-step="1" data-intro="Select a date range to begin. Remeber, only orders in this range will be visible." data-position="right">
      <div class="field padding-b15">
        <label>Dates</label>
        <div class="ui input daterangepicker-container">
          <input type="text" class="ui daterangepicker" v-model="drString">
        </div>
      </div>
    </div>
    <div class="item" data-step="2" data-intro="Search for specific orders by id, builder, subdivision or type.">
      <div class="field padding-b15">
        <label>Search</label>
        <div ref="search" class="ui category search ticket">
          <div class="ui icon input">
            <i class="search icon"></i>
            <input class="prompt" type="text" :placeholder="searchPlaceholder" v-model="search" v-cloak>
          </div>
          <div class="results"></div>
        </div>
      </div>
      <div>
        <div class="pointer padding5" v-for="(filter, key) in filters" v-if="key !== 'daterange'" v-show="filter.value !== 0" @click="filters[key].value = 0">
          <i class="remove circle icon"></i>
          <strong>{{ filter.name }}</strong>
          <span style="display: inline-block">{{ filter.description }}</span>
        </div>
      </div>
    </div>
    <div class="item OrderColumnsButton"></div>
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
        page: 'Orders',
        name: 'OrdersControls'
      },
    }
  },
}
</script>
