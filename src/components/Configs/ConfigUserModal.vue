<template>

  <div id="user_modal" class="ui tiny modal">
    <i class="close icon"></i>
    <div class="header">Update User</div>
    <div class="content">
      <form class="ui form" @submit="update">
        <div class="three fields">
          <div class="field">
            <label>First Name</label>
            <input type="text" v-model="user.fname" placeholder="First Name">
          </div>
          <div class="field">
            <label>Last Name</label>
            <input type="text" v-model="user.lname" placeholder="Last Name">
          </div>
          <div class="field">
            <label>Username</label>
            <input type="text" v-model="user.username" placeholder="Username">
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
      user: {},
      updating: false,
    }
  },
  mounted: function() {
    $(this.$el).modal();
  },
  methods: {
    open: function(user) {
      this.$set('user', user);
      this.$set('updating', false);
      $(this.$el).modal('show');
    },
    update: function(event) {
      event.preventDefault();
      if (this.updating) return;
      this.$set('updating', true);
      $.post(BPC.r.config.user.update, this.user, function (data) {
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
