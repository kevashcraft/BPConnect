<template>

  <div id="task_template_modal" class="ui tiny modal">
    <i class="close icon"></i>
    <div class="header">
      <span v-show="task_template.isnew">Add New</span>
      <span v-show="!task_template.isnew">Update</span>
      <span>Work  Template</span>
    </div>
    <div class="content">
      <form class="ui form" @submit="update">
        <div class="ui message">
          <p>Select when this work should automatically be added to a ticket.</p>
        </div>
        <div class="field">
          <label>Type</label>
          <div class="ui search selection dropdown">
            <input type="hidden" v-model="task_template.ticket_type_id">
            <i class="dropdown icon"></i>
            <div class="default text">Ticket Type</div>
            <div class="menu">
              {% for type in common.ticket_types %}
              <div class="item" data-value="{{ type.id }}">{{ type.type }}</div>
              {% endfor %}
            </div>
          </div>
        </div>
        <div class="field">
          <label>Builder</label>
          <div class="ui search builders">
            <input type="text" class="prompt" name="new_subdivision_builder">
            <div class="results"></div>
          </div>
        </div>
        <div class="field">
          <label>Subdivision</label>
          <div class="ui search subdivisions">
            <input type="text" class="prompt">
            <div class="results"></div>
          </div>
        </div>
        <div class="field">
          <label>City</label>
          <div class="ui search cities">
            <input type="text" class="prompt">
            <div class="results"></div>
          </div>
        </div>
        <div class="field">
          <label>County</label>
          <div class="ui search counties">
            <input type="text" class="prompt">
            <div class="results"></div>
          </div>
        </div>
        <div class="one field">
          <div class="field">
            <label>Work to be Done</label>
            <input type="text" v-model="task_template.task" placeholder="Work to be done..">
          </div>
        </div>
        <div hidden>
          <input type="submit">
        </div>
      </form>
    </div>
    <div class="actions">
      <div class="ui left floated black button">Exit</div>
      <div class="ui green right floasted labeled icon button" @click="update" v-show="!task_template.isnew">
        <span>Save</span>
        <i class="checkmark icon"></i>
      </div>
      <div class="ui green right floasted labeled icon button" @click="update" v-show="task_template.isnew">
        <span>Add</span>
        <i class="plus icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
          task_template: {
          isnew          : true,
          task           : '',
          builder_id     : '',
          house_id       : '',
          subdivision_id : '',
          ticket_type_id : '',
          city_id        : '',
          county_id      : '',
        },
        updating: false,
        isnew: false,
      }
    },
    mounted: function() {
      this.task_templateString = JSON.stringify(this.task_template);
      $(this.$el).modal({
        closable: false,
      });
      this.init();
    },
    methods: {
      init: function () {
        $(this.$el).find('.ui.selection.dropdown').dropdown();
        $(this.$el).find('.search.builders').search({
          apiSettings: {
            method: 'post',
            url: BPC.routes['search.builders'] + '?q={query}',
          },
          onSelect: function (value) {
            this.$set('task_template.builder_id', value.builder_id);
          }.bind(this),
        });
        $(this.$el).find('.search.subdivisions').search({
          apiSettings: {
            method: 'post',
            url: BPC.routes['search.subdivisions'] + '?q={query}',
          },
          onSelect: function (value) {
            this.$set('task_template.subdivision_id', value.subdivision_id);
          }.bind(this),
        });
        $(this.$el).find('.search.cities').search({
          apiSettings: {
            method: 'post',
            url: BPC.routes['search.cities'] + '?q={query}',
          },
          onSelect: function (value) {
            this.$set('task_template.city_id', value.city_id);
          }.bind(this),
        });
        $(this.$el).find('.search.counties').search({
          apiSettings: {
            method: 'post',
            url: BPC.routes['search.counties'] + '?q={query}',
          },
          onSelect: function (value) {
            this.$set('task_template.county_id', value.county_id);
          }.bind(this),
        });
      },
      open: function(task_template) {
        if (task_template === false) {
          this.$set('task_template', JSON.parse(this.task_templateString));
        } else {
          task_template.isnew = false;
          this.$set('task_template', task_template);
          this.$set('task_template', task_template);
        }
        this.$set('updating', false);
        $(this.$el).modal('show');
      },
      update: function(event) {
        event.preventDefault();
        if (this.updating) return;
        this.$set('updating', true);
        var action = this.task_template.isnew ? 'add' : 'update';
        var url = BPC.routes['config.task_template.' + action];
        var data = {
          data: this.task_template,
        }

        $.post(url, data, function (data) {
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
