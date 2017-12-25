import * as Common from '../Common/Common'
import * as ScheduleModel from './ScheduleModel'
import * as TicketsModel from '../Tickets/TicketsModel'

exports.list = async (req) => {
  return ScheduleModel.list(req)
}

exports.retrieve = async (req) => {
  let ticketId = req.body.ticketId
  return ScheduleModel.retrieve(ticketId, req.db)
}

exports.search = async (req) => {
  let categories = ['Tickets', 'Builders', 'Subdivisions', 'Lots', 'Orders']
  return Common.searchCategories(req, categories)
}

exports.updateScheduled = async (req) => {
  let fields = {
    scheduled: req.ticketDateScheduled,
    bumped: { safe: 'bumped + 1' }
  }
  await TicketsModel.update(req.ticketId, fields)
  return true
}

exports.updateSentout = async (req) => {
  let fields = { sentout: { safe: 'current_timestamp' } }
  await TicketsModel.update(req.ticketId, fields)
  return true
}
