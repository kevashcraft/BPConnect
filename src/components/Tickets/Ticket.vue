<template>
  <div id="ticket">
    <div class="ticket-contents">
      <header>
        <i class="arrow left icon" @click="close"></i>
        <div class="centered row">
          <h1>Ticket #{{ ticket.ticket_id }} - {{ ticket.ticket_type }}</h1>
        </div>
        <div class="centered row">
          <h2>{{ ticket.subdivision_name }} Lot {{ ticket.house_lot }}</h2>
        </div>
        <div class="centered row">
          <h3>by {{ticket.builder_name }}</h3>
        </div>
      </header>
      <section>
        <h1>Basic Info</h1>
        <div class="ui grid basic-info">
          <div class="six wide column">
            <div>
              <span>Created</span>
              <span>{{ ticket.date_created }}</span>
            </div>
            <div>
              <span>Scheduled</span>
              <span>{{ ticket.date_scheduled }}</span>
            </div>
            <div>
              <span>Supervisor</span>
              <span>{{ ticket.supervisor_name }}</span>
            </div>
            <div>
              <span>Plumber</span>
              <span>{{ ticket.plumber_name }}</span>
            </div>
            <div>
              <span>Helper</span>
              <span>{{ ticket.helper_name }}</span>
            </div>
          </div>
          <div class="right floated six wide column">
            <div>
              <span>Builder Supervisor</span>
              <span>{{ ticket.builder_supervisor }}</span>
            </div>
            <div>
              <span>Address</span>
              <span>{{ ticket.house_address }}</span>
            </div>
            <div>
              <span>City, Zip</span>
              <span>{{ ticket.house_city }}, {{ ticket.house_zip }}</span>
            </div>
          </div>
        </div>
      </section>
      <section>
        <h1>Permits</h1>
        <div v-for="permit in permits">{{ permit.number }} from {{ permit.inspector }}: {{ permit.starts }} - {{ permit.ends }}</div>
      </section>
      <section>
        <h1>Orders</h1>
        <div v-for="order in orders">{{ order.number }} from {{ order.supplier }} on {{ order.ordered }}, {{ order.received }}% received</div>
      </section>
      <section>
        <h1>Rooms & Parts</h1>
        <div v-for="room in rooms">
          <strong>{{ room.name }} ({{ room.color}})</strong>
          <div v-for="part in room.parts">{{ part.description }} - {{ part.status }}</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ticket  : {},
      permits : [],
      orders  : [],
      rooms   : [],
    }
  },
  methods: {
    open: function(ticket) {
      this.$set('ticket', ticket);
      this.$set('permits', []);
      this.$set('orders', []);
      this.$set('rooms', []);
      $(this.$el).addClass('show');
      this.details();
    },
    close: function() {
      $(this.$el).removeClass('show');
    },
    details: function() {
      var data = { ticket_id: this.ticket.ticket_id };
      $.post(BPC.r.tickets.details, data, function(data) {
        this.permits = data.permits;
        this.orders  = data.orders;
        // this.rooms   = data.rooms;
      }.bind(this), 'json');
    },
  },
}
</script>
