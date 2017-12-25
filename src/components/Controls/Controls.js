import { mapState } from 'vuex'
import { introJs } from 'intro.js'

export default {
  data () {
    return {
      search: '',
      filtersTemplate: {
        daterange: [
          moment().format('YYYY-MM-DD'),
          moment().add(30, 'days').format('YYYY-MM-DD')
        ],
        ticketId: {
          name: 'Ticket',
          value: 0,
          description: null
        },
        orderId: {
          name: 'Order',
          value: 0,
          description: null
        },
        supplierId: {
          name: 'Supplier',
          value: 0,
          description: null
        },
        permitId: {
          name: 'Permit',
          value: 0,
          description: null
        },
        inspectionId: {
          name: 'Inspection',
          value: 0,
          description: null
        },
        inspectorId: {
          name: 'Inspector',
          value: 0,
          description: null
        },
        houseId: {
          name: 'House',
          value: 0,
          description: null
        },
        builderId: {
          name: 'Builder',
          value: 0,
          description: null
        },
        subdivisionId: {
          name: 'Subdivision',
          value: 0,
          description: null
        },
        plumberId: {
          name: 'Plumber',
          value: 0,
          description: null
        },
        helperId: {
          name: 'Helper',
          value: 0,
          description: null
        }
      }
    }
  },
  computed: {
    searchPlaceholder () { return 'Search ' + this.$store.state.pageTitle + '..' },
    drString () {
      if (!this.$store.state.filters.daterange) return
      let dr = this.$store.state.filters.daterange
      let drstart = moment(dr[0]).format('MM/DD/YY')
      let drend = moment(dr[1]).format('MM/DD/YY')
      return drstart + ' - ' + drend
    },
    ...mapState([ 'filters' ])
  },
  mounted () {
    if (!this.filters.daterange) {
      this.$store.commit('filtersSet', this.filtersTemplate)
    }

    $(this.$refs.search).search({
      type: 'category',
      apiSettings: {
        responseAsync: (settings, callback) => {
          let route = this.meta.page + ':search'
          let data = { query: settings.urlData.query }
          this.$root.req(route, data).then(callback)
        }
      },
      selectFirstResult: true,
      onSelect: (result, response) => {
        this.search = ''
        this.$store.commit('filterSet', {
          key: result.filter,
          filter: {
            value: result.id,
            description: result.title,
            name: this.filters[result.filter].name
          }
        })
      }
    })

    $('.daterangepicker').daterangepicker({
      opens: 'right',
      drops: 'down',
      format: 'MM/DD/YY',
      startDate: moment(this.filters.daterange[0]),
      endDate: moment(this.filters.daterange[1]),
      ranges: {
        'Next 30 Days': [moment(), moment().add(30, 'days')],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      }
    }, (start, end, label) => {
      var daterange = [
        start.format('YYYY-MM-DD'),
        end.format('YYYY-MM-DD')
      ]
      this.filters.daterange = daterange
      this.$store.commit('filtersSet', this.filters)
      // this.filters.daterange = daterange;
    })
  },
  methods: {
    walkthrough: function () {
      introJs().start()
    }
  }
}
