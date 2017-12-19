import * as ScheduleModel from './ScheduleModel'

exports.list = async (req, res) => {
  let fields = {
    drstart: req.body.daterange[0],
    drend: req.body.daterange[1],
    ticketId: req.body.ticketId,
    builderId: req.body.builderId,
    subdivisionId: req.body.subdivisionId,
    houseId: req.body.houseId,
    plumberId: req.body.plumberId,
    helperId: req.body.helperId,
  }

  return await ScheduleModel.list(fields, req.db)
}

exports.retrieve = async (req, res) => {
  let ticketId = req.body.ticketId
  return await ScheduleModel.retrieve(ticketId, req.db)
}

exports.search = async (req, res) => {
  let query = req.body.query
  return await ScheduleModel.search(query, req.db)
}

exports.update = async (req, res) => {
  let fields = {
    ticketId: req.body.ticketId,
    scheduled: req.body.scheduled
  }

  return ScheduleModel.update(fields, req.db)
}
