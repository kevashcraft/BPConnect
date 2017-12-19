<template>

  <div id="subdivision_modal" class="ui tiny modal">
    <i class="close icon"></i>
    <div class="header">Update User</div>
    <div class="content">
      <form class="ui form" @submit="update">
        <div class="one field">
          <div class="field">
            <label>Subdivision Name</label>
            <input type="text" v-model="subdivision.name" placeholder="Subdivision Name">
          </div>
          <div class="field">
            <label>City, State & ZIP</label>
            <div class="ui search zips">
              <input type="text" class="prompt">
              <div class="results"></div>
            </div>
          </div>
        </div>
        <div hidden>
          <input type="submit">
        </div>
      </form>
    </div>
    <div class="actions">
      <div class="ui left floated black deny button">Exit</div>
      <div class="ui positive right floasted labeled icon button" @click="update">
        Save
        <i class="checkmark icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        subdivision: {},
        updating: false,
      }
    },
    mounted: function() {
      $(this.$el).modal();


      $(this.$el).find('.search.zips').search({
        apiSettings: {
          method: 'post',
          url: BPC.routes['search.zips'] + '?q={query}',
        },
        onSelect: function (value) {
          this.$set('subdivision.zip_id', value.zip_id);
        }.bind(this),
      });

    },
    methods: {
      open: function(user) {
        this.$set('subdivision', user);
        this.$set('updating', false);
        $(this.$el).modal('show');
      },
      update: function(event) {
        event.preventDefault();
        if (this.updating) return;
        this.$set('updating', true);
        $.post(BPC.r.config.subdivision.update, this.subdivision, function (data) {
          this.$set('updating', false);
          BPC.overhang(data.message, data.success);
          if (data.success) {
            $(this.$el).modal('hide');
            BPC.config.update();
          }
        }.bind(this), 'json');

        event.preventDefault();
      },
    },
  }
</script>
