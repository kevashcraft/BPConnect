<template>
  <div class="ui tiny modal">
    <i class="close icon"></i>
    <div class="header">
      <span v-show="taskTemplate.isnew">Add New</span>
      <span v-show="!taskTemplate.isnew">Update</span>
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
            <input type="hidden" v-model="taskTemplate.ticketTypeId">
            <i class="dropdown icon"></i>
            <div class="default text">Ticket Type</div>
            <div class="menu">
              {% for type in common.ticketTypes %}
              <div class="item" data-value="{{ type.id }}">{{ type.type }}</div>
              {% endfor %}
            </div>
          </div>
        </div>
        <div class="field">
          <label>Builder</label>
          <div class="ui search builders">
            <input type="text" class="prompt" name="newSubdivisionBuilder">
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
            <input type="text" v-model="taskTemplate.task" placeholder="Work to be done..">
          </div>
        </div>
        <div hidden>
          <input type="submit">
        </div>
      </form>
    </div>
    <div class="actions">
      <div class="ui left floated black button">Exit</div>
      <div class="ui green right floasted labeled icon button" @click="update" v-show="!taskTemplate.isnew">
        <span>Save</span>
        <i class="checkmark icon"></i>
      </div>
      <div class="ui green right floasted labeled icon button" @click="update" v-show="taskTemplate.isnew">
        <span>Add</span>
        <i class="plus icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import Modal from '../Modal/Modal'

  export default {
    mixins: [ Modal ],
    data () {
      return {
        meta: {
          name: 'ConfigTaskTemplateModal'
        },
          taskTemplate: {
          isnew          : true,
          task           : '',
          builderId     : '',
          houseId       : '',
          subdivisionId : '',
          ticketTypeId : '',
          cityId        : '',
          countyId      : '',
        },
        updating: false,
        isnew: false,
      }
    },
    methods: {
      init: function () {
        $(this.$el).find('.ui.selection.dropdown').dropdown()
        // $(this.$el).find('.search.builders').search({
        //   apiSettings: {
        //     method: 'post',
        //     url: BPC.routes['search.builders'] + '?q={query}',
        //   },
        //   onSelect: function (value) {
        //     this.$set('taskTemplate.builderId', value.builderId)
        //   }.bind(this),
        // })
        // $(this.$el).find('.search.subdivisions').search({
        //   apiSettings: {
        //     method: 'post',
        //     url: BPC.routes['search.subdivisions'] + '?q={query}',
        //   },
        //   onSelect: function (value) {
        //     this.$set('taskTemplate.subdivisionId', value.subdivisionId)
        //   }.bind(this),
        // })
        // $(this.$el).find('.search.cities').search({
        //   apiSettings: {
        //     method: 'post',
        //     url: BPC.routes['search.cities'] + '?q={query}',
        //   },
        //   onSelect: function (value) {
        //     this.$set('taskTemplate.cityId', value.cityId)
        //   }.bind(this),
        // })
        // $(this.$el).find('.search.counties').search({
        //   apiSettings: {
        //     method: 'post',
        //     url: BPC.routes['search.counties'] + '?q={query}',
        //   },
        //   onSelect: function (value) {
        //     this.$set('taskTemplate.countyId', value.countyId)
        //   }.bind(this),
        // })
      },
      afterOpen: function(taskTemplate) {
        if (taskTemplate === false) {
          this.$set('taskTemplate', JSON.parse(this.taskTemplateString))
        } else {
          taskTemplate.isnew = false
          this.$set('taskTemplate', taskTemplate)
          this.$set('taskTemplate', taskTemplate)
        }
        this.$set('updating', false)
        $(this.$el).modal('show')
      },
      update: function(event) {
        event.preventDefault()
        if (this.updating) return
        this.$set('updating', true)
        var action = this.taskTemplate.isnew ? 'add' : 'update'
        var url = BPC.routes['config.taskTemplate.' + action]
        var data = {
          data: this.taskTemplate,
        }

        $.post(url, data, function (data) {
          this.$set('updating', false)
          BPC.overhang(data.message, data.success)
          if (data.success) {
            $(this.$el).modal('hide')
            BPC.config.update()
          }
        }.bind(this), 'json')

        event.preventDefault()
      },
    },
  }
</script>
