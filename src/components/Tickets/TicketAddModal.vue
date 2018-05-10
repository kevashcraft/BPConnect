<template>
  <div class="ui tiny modal">
    <i class="close icon"></i>
    <div class="header">Add a Ticket</div>
    <div class="content">
      <form @submit="create" class="ui form">
        <!-- {# Type & Date #} -->
        <div v-show="step === 'typeDate'">
          <div class="ui icon message">
            <i class="calendar blue icon"></i>
            <div class="content">
              <div class="header">Ticket Type & Date</div>
              <p>To start, select the ticket type and date</p>
            </div>
          </div>
          <div class="field">
            <label>Type</label>
            <div class="ui ticketTypes search selection dropdown">
              <input type="hidden">
              <i class="dropdown icon"></i>
              <div class="default text">Ticket Type</div>
              <div class="menu">
                <div class="item" v-for="type in ticketTypes" :data-value="type.id">{{ type.type }}</div>
              </div>
            </div>
          </div>
          <div class="field">
            <label>Date</label>
            <input type="date" v-model="ticket.ticketDate">
          </div>

        </div>
        <!-- {# Subdivision & Lot #} -->
        <div v-show="step === 'ticketLot'">
          <div class="ui icon message">
            <i class="marker green icon"></i>
            <div class="content">
              <div class="header">Subdivision & Lot</div>
              <p>Select the lot for this ticket, or <a href="#" class="refresh" @click="ticket.houseId = -1">add a new one</a> and select the subdivision.</p>
            </div>
          </div>
          <div class="fields">
            <div class="ten wide field" :class="{disabled: ticket.houseId === -1}">
              <label>Lot Search</label>
              <div class="ui search houses">
                <div class="ui left icon input">
                  <input type="text" class="prompt" placeholder="Search for a lot">
                  <i class="home icon"></i>
                </div>
                <div class="results"></div>
              </div>
            </div>
            <div class="six wide field relative">
              <div class="ui labeled icon button pop-up refresh bottom" v-show="ticket.houseId !== -1" @click="ticket.houseId = -1" data-title="Add a New Lot" data-content="Add a new lot instead of searching for one">Add a New Lot<i class="plus icon"></i></div>
              <div class="ui labeled icon button pop-up refresh bottom" v-show="ticket.houseId === -1" @click="ticket.houseId = 0" data-title="Search for Existing Lot" data-content="Switch to searching for a lot instead of adding one">Search for a Lot<i class="search icon"></i></div>
            </div>
          </div>
          <div class="fields" v-show="ticket.houseId === -1">
            <div class="ten wide field" :class="{disabled: ticket.subdivisionId === -1}">
              <label>Subdivision Search</label>
              <div class="ui search subdivisions">
                <div class="ui left icon input">
                  <input type="text" class="prompt" placeholder="Search for a subdivision">
                  <i class="sun o icon"></i>
                </div>
                <div class="results"></div>
              </div>
            </div>
            <div class="six wide field relative">
              <div class="ui labeled icon button pop-up refresh bottom" v-show="ticket.subdivisionId !== -1" @click="ticket.subdivisionId = -1" data-title="Add a New Subdivision" data-content="Add a new subdivision instead of searching for one"><i class="plus icon"></i>New Subdivision</div>
              <div class="ui labeled icon button pop-up refresh bottom" v-show="ticket.subdivisionId === -1" @click="ticket.subdivisionId = 0" data-title="Search for Existing Subdivision" data-content="Switch to searching for a subdivision instead of adding one "><i class="search icon"></i>Subdivision Search</div>
            </div>
          </div>
          <div class="fields" v-show="ticket.subdivisionId === -1">
            <div class="ten wide field" :class="{disabled: ticket.builderId === -1}">
              <label>Builder Search</label>
              <div class="ui search builders">
                <div class="ui left icon input">
                  <input type="text" class="prompt" placeholder="Search for a builder">
                  <i class="bandcamp icon"></i>
                </div>
                <div class="results"></div>
              </div>
            </div>
            <div class="six wide field relative">
              <div class="ui labeled icon button pop-up refresh bottom" v-show="ticket.builderId !== -1" @click="ticket.builderId = -1; ticket.builderSupervisorId = -1" data-title="Add a New Builder" data-content="Add a new builder instead of searching for one"><i class="plus icon"></i>Add Builder</div>
              <div class="ui labeled icon button pop-up refresh bottom" v-show="ticket.builderId === -1" @click="ticket.builderId = 0; ticket.builderSupervisorId = 0" data-title="Search for Existing Builder" data-content="Switch to searching for a builder instead of adding one "><i class="search icon"></i>Builder Search</div>
            </div>
          </div>
          <div class="field" v-show="ticket.builderId === -1">
            <label>Builder Name</label>
            <div class="ui left icon input">
              <i class="bandcamp icon"></i>
              <input type="text" v-model="ticket.builderName" placeholder="Builder Name">
            </div>
          </div>
          <div class="field" v-show="ticket.builderId === -1">
            <label>Builder Phone</label>
            <div class="ui left icon input">
              <i class="phone icon"></i>
              <input type="tel" v-model="ticket.builderPhone" placeholder="Builder phone number">
            </div>
          </div>
          <div class="field" v-show="ticket.subdivisionId === -1">
            <label>Subdivision Name</label>
            <div class="ui left icon input">
              <i class="sun o icon"></i>
              <input type="text" v-model="ticket.subdivisionName" placeholder="Subdivision name">
            </div>
          </div>
          <div class="fields" v-show="ticket.houseId === -1">
            <div class="four wide field">
              <label>Lot Number</label>
              <div class="ui left icon input">
                <i class="list ol icon"></i>
                <input type="text" name="ticketHouseLot" v-model="ticket.houseLot" placeholder="Lot number">
              </div>
            </div>
            <div class="twelve wide field">
              <label>Lot Address</label>
              <div class="ui left icon input">
                <i class="home icon"></i>
                <input type="text" name="ticketHouseAddress" v-model="ticket.houseAddress" placeholder="Lot street address">
              </div>
            </div>
          </div>
          <div class="field" v-show="ticket.subdivisionId === -1">
            <label>Location Search</label>
            <div class="ui search locations">
              <div class="ui left icon input">
                <i class="globe icon"></i>
                <input type="search" class="prompt" v-model="ticket.subdivisionZip" placeholder="Search for city and state">
              </div>
              <div class="results"></div>
            </div>
          </div>
        </div>
        <div v-show="step === 'ticketSupervisors'">
          <div class="ui icon message">
            <i class="spy red icon"></i>
            <div class="content">
              <div class="header">Ticket Supervisors</div>
              <p>Select the builder supervisor and Bordeau Plumbing's supervisor.</p>
            </div>
          </div>
          <div class="fields">
            <div class="ten wide field" :class="{ disabled: ticket.builderSupervisorId === -1 }">
              <label>Builder Supervisor</label>
              <div class="ui builderSupervisors search selection dropdown">
                <input type="hidden" v-model="ticket.builderSupervisorId">
                <div class="default text">Builder Supervisors</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                  <div v-for="supervisor in builderSupervisors" class="item" :data-value="supervisor.id">{{ supervisor.name }}</div>
                </div>
              </div>
            </div>
            <div class="six wide field relative">
              <div class="ui labeled icon button pop-up refresh bottom" v-show="ticket.builderSupervisorId !== -1" @click="ticket.builderSupervisorId = -1" data-title="Add a Builder Supervisor" data-content="Add a new builder supervisor instead of searching for one"><i class="plus icon"></i>New Supervisor</div>
              <div class="ui labeled icon button pop-up refresh bottom" v-show="ticket.builderSupervisorId === -1" @click="ticket.builderSupervisorId = 0" data-title="Select Existing Supervisor" data-content="Switch to searching for a supervisor instead of adding one "><i class="search icon"></i>Search Supervisors</div>
            </div>
          </div>
          <div class="field" v-show="ticket.builderSupervisorId === -1">
            <label>Supervisor Name</label>
            <div class="ui left icon input">
              <i class="spy icon"></i>
              <input type="text" v-model="ticket.builderSupervisorName" placeholder="Builder supervisor's name">
            </div>
          </div>
          <div class="field" v-show="ticket.builderSupervisorId === -1">
            <label>Phone Number</label>
            <div class="ui left icon input">
              <i class="phone icon"></i>
              <input type="tel" v-model="ticket.builderSupervisorPhone" placeholder="Builder supervisor's phone number">
            </div>
          </div>
          <div class="field">
            <label>BP Supervisor</label>
            <div class="ui supervisors search selection dropdown">
              <input type="hidden" v-model="ticket.supervisorId">
              <div class="default text">BP Supervisors</div>
              <i class="dropdown icon"></i>
              <div class="menu">
                <div v-for="supervisor in supervisors" :data-value="supervisor.id" class="item">{{ supervisor.name }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="step === 'ticketEinfo'">
          <div class="ui icon message">
            <i class="browser green icon"></i>
            <div class="content">
              <div class="header">Additional Info</div>
              <p>Include the additional info for this ticket.</p>
            </div>
          </div>
          <div class="field" v-show="ticket.ticketNeedspo">
            <label>PO Number</label>
            <input type="text" v-model="ticket.poNumber">
          </div>
          <div class="field" v-show="ticket.ticketNeedsepo">
            <label>EPO Number</label>
            <input type="text" v-model="ticket.epoNumber">
          </div>
<!--           <div v-show="typeSelected.slug == 'sewer'">
            <div class="field">
              <label>EPO Number</label>
              <input type="text" v-model="ticket.epoNumber">
            </div>
          </div>
 -->        </div>
        <div v-show="step == 'ticketFinish'">
          <div class="ui icon message">
            <i class="check circle yellow icon"></i>
            <div class="content">
              <div class="header">Confirm & Add</div>
              <p>Confirm everything and then add the ticket.</p>
            </div>
          </div>
          <div class="two fields">
            <div class="field">
              <label>Type</label>
              <input type="text" v-model="ticket.ticketTypeName" disabled>
            </div>
            <div class="field">
              <label>Date</label>
              <input type="text" v-model="ticket.ticketDate" disabled>
            </div>
            <i class="edit icon pop-up" data-content="Edit Type & Date" @click="goto('typeDate')"></i>
          </div>
          <div class="two fields">
            <div class="field">
              <label>Subdivision</label>
              <input type="text" v-model="ticket.subdivisionName" disabled>
            </div>
            <div class="field">
              <label>Lot</label>
              <input type="text" v-model="ticket.houseLot" disabled>
            </div>
            <i class="edit icon pop-up" data-content="Edit Subdivision & Lot" @click="goto('ticketLot')"></i>
          </div>
          <div class="two fields">
            <div class="field">
              <label>Builder Supervisor</label>
              <input type="text" v-model="ticket.builderSupervisorName" disabled>
            </div>
            <div class="field">
              <label>BP Supervisor</label>
              <input type="text" v-model="ticket.supervisorName" disabled>
            </div>
            <i class="edit icon pop-up" data-content="Edit Supervisors" @click="goto('ticketSupervisors')"></i>
          </div>
          <div class="ui errors">
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
    <div class="actions" style="padding-botom: 14px">
      <div v-show="stepIndex === 0">
        <div class="ui green icon button" @click="goto(1)">
          <span>Next</span>
          <i class="arrow right icon"></i>
        </div>
      </div>
      <div v-show="stepIndex !== 0 && stepIndex !== stepsLength">
        <div class="ui gray left floated icon button" @click="goto(-1)">
          <i class="arrow left icon"></i>
          <span>Back</span>
        </div>
        <div class="ui green icon button" @click="goto(1)">
          <span>Next</span>
          <i class="arrow right icon"></i>
        </div>
      </div>
      <div v-show="stepIndex === stepsLength">
        <div class="ui gray left floated icon button" @click="goto(-1)">
          <i class="arrow left icon"></i>
          <span>Back</span>
        </div>
        <div class="ui green icon button" @click="create">
          <span>Add Ticket</span>
          <i class="checkmark icon"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Modal from '../Modal/Modal'

export default {
  data () {
    return {
      meta: {
        name: 'TicketAddModal',
      },
      errors: [],
      ticket: {
        ticketDate              : moment().format('YYYY-MM-DD'),
        ticketTypeId           : 0,
        ticketTypeName         : '',
        houseId                 : 0,
        houseLot                : '',
        houseAddress            : '',
        cityId                  : 0,
        city                     : '',
        countyId                : 0,
        county                   : '',
        stateId                 : 0,
        state                    : '',
        zipId                   : 0,
        zip                      : '',
        subdivisionId           : 0,
        subdivisionName         : '',
        subdivisionZipId       : 0,
        builderId               : 0,
        builderName             : '',
        builderSupervisorId    : 0,
        builderSupervisorName  : '',
        builderSupervisorPhone : '',
        supervisorId         : 0,
      },
      steps: [
        'typeDate',
        'ticketLot',
        'ticketSupervisors',
        // 'ticketEinfo',
        'ticketFinish',
      ],
      stepsLength: 0,
      stepIndex: 1,
      step: 'ticketLot',
    }
  },
  computed: {
    builderSupervisors () {
      let builderSupervisorsAll = this.$store.state.builderSupervisors
      let builderSupervisors = builderSupervisorsAll[this.ticket.builderId] || []

      return builderSupervisors
    },
    supervisors () {
      return this.$store.state.workers.filter(worker => {
        // return worker.type === 'supervisor'
        return true
      })
    },
    ...mapState([
      'ticketTypes'
    ])
  },
  mixins: [ Modal ],
  mounted () {
    this.emptyTicket = JSON.stringify(this.ticket)
    this.stepsLength = this.steps.length - 1

    $(this.$el).find('.refresh').on('click', () => {
      setTimeout(() => {
        $(this.$el).modal('refresh')
      }, 15)
    })
    $(this.$el).find('.ui.selection').dropdown()


    $(this.$el).find('.search.locations').search({
      selectFirstResult: true,
      apiSettings: {
        responseAsync: (settings, callback) => {
          let route = 'Locations:search'
          let data = { query: settings.urlData.query }
          this.$root.req(route, data).then(callback)
        }
      },
      onSelect: (value) => {
        this.ticket.zipcodeId = value.id
      }
    })

    $(this.$el).find('.search.builders').search({
      selectFirstResult: true,
      apiSettings: {
        responseAsync: (settings, callback) => {
          let route = 'Builders:search'
          let data = { query: settings.urlData.query }
          this.$root.req(route, data).then(callback)
        }
      },
      onSelect: (value) => {
        this.ticket.builderId = value.builderId
        if (value.builderId === -1) {
          this.ticket.subdivisionId = 0
          this.ticket.builderName = ''
        } else {
          this.ticket.builderName = value.builderName
        }
      },
    })

    $(this.$el).find('.search.houses').search({
      selectFirstResult: true,
      apiSettings: {
        responseAsync: (settings, callback) => {
          let route = 'Houses:search'
          let data = { query: settings.urlData.query }
          this.$root.req(route, data).then(callback)
        }
      },
      onSelect: (value) => {
        this.ticket.houseId = value.houseId
        if (value.houseId > 0) {
          this.ticket.houseLot = value.houseLot
          this.ticket.subdivisionId = value.subdivisionId
          this.ticket.subdivisionName = value.subdivisionName
          this.ticket.builderId = value.builderId
          this.ticket.builderName = value.builderName
          this.ticket.zipcodeId = value.zipcodeId
        }
      },
    })

    $(this.$el).find('.ticketTypes.dropdown').dropdown({
      onChange: (value) => {
        let ticketTypeId = parseInt(value)

        this.ticket.ticketTypeId = ticketTypeId
        if (ticketTypeId === -1) {
          this.ticket.ticketTypeName = ''
        } else {
          let ticketType = this.ticketTypes.find(ticketType => {return ticketType.id === ticketTypeId})
          this.ticket.ticketTypeName = ticketType.type
          this.ticket.ticketNeedsPo = ticketType.needspo
          this.ticket.ticketNeedsPermit = ticketType.needspermit
          this.ticket.ticketDetails = ticketType.details
        }
      }
    })

    $(this.$el).find('.builderSupervisors.dropdown').dropdown({
      onChange: (value) => {
        let builderSupervisorId = parseInt(value)
        if (builderSupervisorId === -1) {
          this.ticket.builderSupervisorName = ''
        } else {
          let builderSupervisor = this.builderSupervisors.find(supervisor => {
            return supervisor.id === builderSupervisorId
          })

          if (builderSupervisor) {
            this.ticket.builderSupervisorId = builderSupervisor.id
            this.ticket.builderSupervisorName = builderSupervisor.name
          } else {
            this.ticket.builderSupervisorId = 0
            this.ticket.builderSupervisorName = ''
          }
        }
      }
    })

    $(this.$el).find('.supervisors.dropdown').dropdown({
      onChange: (value) => {
        let supervisorId = parseInt(value)
        if (supervisorId === -1) {
          this.ticket.supervisorName = ''
        } else {
          let supervisor = this.supervisors.find(supervisor => {
            return supervisor.id === supervisorId
          })

          if (supervisor) {
            this.ticket.supervisorId = supervisor.id
            this.ticket.supervisorName = supervisor.name
          } else {
            this.ticket.supervisorId = 0
            this.ticket.supervisorName = ''
          }
        }
      }
    })

    $(this.$el).find('.search.subdivisions').search({
      selectFirstResult: true,
      apiSettings: {
        responseAsync: (settings, callback) => {
          let route = 'Subdivisions:search'
          let data = { query: settings.urlData.query }
          this.$root.req(route, data).then(callback)
        }
      },
      onSelect: (value) => {
        this.ticket.subdivisionId = value.subdivisionId
        if (value.subdivisionId === -1) {
          this.ticket.subdivisionName = ''
          this.ticket.builderId = 0
          this.ticket.builderName = ''
          this.ticket.cityId = 0
          this.ticket.city = ''
          this.ticket.countyId = 0
          this.ticket.county = ''
          this.ticket.stateId = 0
          this.ticket.state = ''
          this.ticket.zipcodeId = 0
          this.ticket.zipcode = ''
        } else {
          this.ticket.subdivisionName = value.subdivisionName
          this.ticket.builderId = value.builderId
          this.ticket.builderName = value.builderName
          this.ticket.cityId = value.cityId
          this.ticket.city = value.city
          this.ticket.countyId = value.countyId
          this.ticket.county = value.county
          this.ticket.stateId = value.stateId
          this.ticket.state = value.state
          this.ticket.zipcodeId = value.zipcodeId
          this.ticket.zipcode = value.zipcode
        }
      },
    })
  },
  watch: {
    step () {
      setTimeout(() => {
        $(this.$el).modal('refresh')
      }, 50)
    },
    'ticket.houseId' (houseId) {
      var houseId = parseInt(houseId)
      if (houseId <= 0) {
        this.ticket.houseLot =  ''
        this.ticket.subdivisionId =  0
        this.ticket.subdivisionName =  ''
        this.ticket.builderId =  0
        this.ticket.builderName =  ''
        this.ticket.zipId =  0
        $('.search.houses').search('set value', '')
      }
    },
  },
  methods: {
    afterOpen () {
      this.step = this.steps[0]
      this.stepIndex = 0
    	this.ticket = JSON.parse(this.emptyTicket)
      (this.$el).find('.search').search('set value', '')
    },
    goto (step) {
      if (Number.isInteger(step)) {
        this.stepIndex += step
        this.step = this.steps[this.stepIndex]
      } else {
        this.step = step
        this.stepIndex = this.steps.indexOf(this.step)
      }
    },
    create () {
      var errors = []
      if (!this.ticket.ticketTypeId) {
        errors.push('Select Ticket Type')
      }
      if (this.ticket.ticketDate.length < 1) {
        errors.push('Select a Date')
      }
      if (!this.ticket.houseId) {
        if (!this.ticket.houseLot.length) {
          errors.push('Add or Select a Lot')
        }
      }
      if (!this.ticket.subdivisionId) {
        errors.push('Add or Select a Subdivision')
      }
      if (!this.ticket.builderId) {
        errors.push('Add or Select a Builder')
      }

      if (errors.length === 0) {

        var data = {
          ticket: this.ticket,
        }

        this.$root.req('Tickets:create', data).then((response) => {
          if (response) {
            this.close()
            this.$emit('update')
            this.$root.noty(`Ticket ${response} has been added`)
          } else {
            this.$root.noty('Could not add the ticket', 'error')
          }
        })
      } else {
        this.errors = errors
      }

    },
  },
}
</script>
