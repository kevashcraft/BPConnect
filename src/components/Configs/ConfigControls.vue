<template>
  <div class="item" id="config_controls">
    <div class="segment">
      <div class="ui fluid selection dropdown">
        <input type="hidden" v-dropdown="selected">
        <i class="dropdown icon"></i>
        <div class="default text">Select List</div>
        {% verbatim %}
        <div class="menu">
          <div class="item" v-for="option in options" :data-value="option.value">{{ option.title }}</div>
        </div>
        {% endverbatim %}
      </div>
    </div>
    <br>
    <div class="segment">
      <div class="ui fluid large icon input">
        <input type="text" v-model="search" placeholder="Search...">
        <i class="search icon"></i>
      </div>
    </div>
    <div class="segment">
      <div class="ui fluid button" @click="add_new">Add New</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

      selected: null,
      search: '',
      options: [
        {
          title: 'Users',
          value: 'user',
        },
        {
          title: 'Builders',
          value: 'builder',
        },
        {
          title: 'Subdivisions',
          value: 'subdivision',
        },
        {
          title: 'Work Templates',
          value: 'task_template',
        },
      ],
    }
  },
  watch: {
    selected: function(selected) {
      BPC.config.$set('selected', selected);
    },
    search: function(search) {
      BPC.config.config_table.search(search).draw();
    },
  },

  methods: {
    add_new: function () {
      var modal = BPC.config.selected + '_modal';
      BPC.config[modal].open(false);
    },
  },
}
</script>
