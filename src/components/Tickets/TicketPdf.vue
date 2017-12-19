<!DOCTYPE html>
<html>
<style type="text/css">
@page {
  margin: 25px;
}
body {
}
header img {
  position: absolute;
  top: 5px;
  left: 0;
  height: 95px;
  vertical-align: middle;
}
hgroup {
  display: block;
  text-align: center;
}
hgroup * {
  margin: 0;
}

</style>
<head>
  <title>Ticket PDF</title>
</head>
<body>
  <header>
    <img src="{{dir}}/graphics/bpc-logo.png">
    <hgroup>
      <h1>Ticket #{{ ticket.ticket_id }} {{ ticket.ticket_type }}</h1>
      <h2>{{ ticket.subdivision_name }} {{ ticket.house_lot }}</h2>
      <h3>by {{ ticket.builder_name }}</h3>
    </hgroup>
  </header>
  <article>
    <section>
      <header>Job Info</header>
      <div>
        <div>
          <div>
            <span>Date Scheduled</span>
            <span>{{ ticket.date_scheduled }}</span>
          </div>
          <div>
            <span>Bordeau's Supervisor</span>
            <span>{{ ticket.supervisor_name }}</span>
          </div>
          <div>
            <span>Plumber</span>
            <span>{{ ticket.plumber_name }}</span>
          </div>
          <div>
          </div>
        </div>
        <div>
          <div>
            <span>Builder</span>
            <span>{{ ticket.builder_name }}</span>
          </div>
          <div>
            <span>Builder's Supervisor</span>
            <span>{{ ticket.builder_supervisor }} {% if ticket.builder_supervisor_phone %}({{ ticket.builder_supervisor_phone }}){% endif %}</span>
          </div>
          <div>
            <span>Subdivision</span>
            <span>{{ ticket.subdivision_name }}</span>
          </div>
          <div>
            <span>Lot</span>
            <span>{{ ticket.house_lot }}</span>
          </div>
          <div>
            <span>Address</span>
            <span>{{ ticket.house_address }}</span>
          </div>
          <div>
            <span>City, State </span>
            <span>{{ ticket.house_city }}, {{ ticket.house_state }} {{ ticket.house_zip }}</span>
          </div>
        </div>
      </div>
    </section>
    <section>
      {% for room, parts in ticket_rooms %}
      <div>
        <h4>{{ room }}</h4>
        <div>
          {% for part in parts %}
            <div>{{ part.part_description }}</div>
          {% endfor %}
        </div>
      </div>
      {% endfor %}
    </section>
  </article>
</body>
</html>
