import * as ScheduleModel from './ScheduleModel'

exports.list = async (req) => {

  return await ScheduleModel.list(req)
}

exports.retrieve = async (req) => {
  let ticketId = req.body.ticketId
  return await ScheduleModel.retrieve(ticketId, req.db)
}

exports.search = async (req) => {
  let query = req.body.query
  return await ScheduleModel.search(query, req.db)
}

exports.update = async (req) => {
  let fields = {
    ticketId: req.body.ticketId,
    scheduled: req.body.scheduled
  }

  return ScheduleModel.update(fields, req.db)
}
