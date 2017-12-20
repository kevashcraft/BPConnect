import { mapState } from 'vuex'
import { introJs } from 'intro.js'

export default {
  data () {
    return {
      search: '',
      filtersTemplate : {
        daterange : [
          moment().format('YYYY-MM-DD'),
          moment().add(30, 'days').format('YYYY-MM-DD')
        ],
        ticketId: 0,
        orderId: 0,
        supplierId: 0,
        permitId: 0,
        inspectionId: 0,
        inspectorId: 0,
        houseId: 0,

        builderId: 0,
        subdivisionId: 0,
        plumberId: 0,
        helperId: 0,
      },
    }
  },
  computed: {
    searchPlaceholder () { return 'Search ' + this.$store.state.pageTitle + '..' },
    drString () {
      let dr = this.$store.state.filters.daterange
      let drstart = moment(dr[0]).format('MM/DD/YY')
      let drend = moment(dr[1]).format('MM/DD/YY')
      return drstart + ' - ' + drend
    },
    ...mapState([ 'filters' ]),
  },
  mounted () {
    if (!this.filters.daterange) {
      this.$store.commit('filtersSet', this.filtersTemplate)
    }

    $('.daterangepicker').daterangepicker({
      opens: 'right',
      drops: 'down',
      format: 'MM/DD/YY',
      startDate: moment(this.filters.daterange[0]),
      endDate: moment(this.filters.daterange[1]),
      ranges: {
          'Next 30 Days': [moment(), moment().add(30, 'days'),],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      },
    }, (start, end, label) => {
      var daterange = [
        start.format('YYYY-MM-DD'),
        end.format('YYYY-MM-DD')
      ];
      this.filters.daterange = daterange
      this.$store.commit('filtersSet', this.filters)
      // this.filters.daterange = daterange;
    });
  },
  methods: {
    walkthrough: function() {
      introJs().start()
    },
  }
}