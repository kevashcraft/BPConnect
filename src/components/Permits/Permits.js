import PermitsModel from './PermitsModel'

exports.list = async (req, res) => {
  let fields = {
    drstart: req.body.daterange[0],
    drend: req.body.daterange[1],
    permitId: req.body.permitId,
    ticketId: req.body.ticketId,
    inspectorId: req.body.inspectorId,
    houseId: req.body.houseId,
  }

  return await PermitsModel.list(fields, req.db)
}

exports.retrieve = async (req, res) => {
  let permitId = req.body.permitId
  return await PermitsModel.retrieve(permitId, req.db)
}

exports.search = async (req, res) => {
  let query = req.body.query

  return await PermitsModel.search(query, req.db)
}

exports.update = async (req, res) => {
  let permitId = req.body.permitId
  let fields = {
    name: req.body.name,
    starts: req.body.starts,
    ends: req.body.ends,
    inspectorId: req.body.inspectorId,
  }

  return await PermitsModel.update(permitId, fields, req.db)
}
