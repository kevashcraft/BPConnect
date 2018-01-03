<div id="builder_modal" class="ui tiny modal">
  <i class="close icon"></i>
  <div class="header">Update Builder</div>
  <div class="content">
    <form class="ui form" @submit="update">
      <div class="field">
        <label>Name</label>
        <input type="text" v-model="builder.name" placeholder="Builder Name">
      </div>
      <div class="field">
        <label>Address</label>
        <input type="text" v-model="builder.address" placeholder="Builder Address">
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

<script>
  export default {
    data () {
      return {
        builder: {},
        updating: false,
      }
    },
    mounted: function() {
        $(this.$el).modal();
    },
    methods: {
      open: function(builder) {
        this.$set('builder', builder);
        this.$set('updating', false);
        $(this.$el).modal('show');
      },
      update: function(event) {
        event.preventDefault();
        if (this.updating) return;
        this.$set('updating', true);
        $.post(BPC.r.config.builder.update, this.builder, function (data) {
          this.$set('updating', false);
          BPC.overhang(data.message, data.success);
          if (data.success) {
            $(this.$el).modal('hide');
            BPC.config.update();
          }
        }.bind(this), 'json');

        event.preventDefault();
        console.log("event",event);
      },
    },
  }
</script>
