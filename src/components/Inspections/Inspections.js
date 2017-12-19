import InspectionsModel from './InspectionsModel'

exports.schedule = async (req, res) => {
  let inspectionId = req.body.inspectionId
  let fields = { scheduled: req.body.scheduled }
  return await InspectionsModel.update(inspectionId, fields)
}

exports.pass = async (req, res) => {
  let inspectionId = req.body.inspectionId
  let fields = { passed: req.body.passed }
  return await InspectionsModel.update(inspectionId, fields)
}

exports.fail = async (req, res) => {
  let inspectionId = req.body.inspectionId
  let fields = { failed: req.body.failed }
  return await InspectionsModel.update(inspectionId, fields)
}

exports.list = async (req, res) => {
  let fields = {
    drstart: req.body.daterange[0],
    drend: req.body.daterange[1],
    ticketId: req.body.ticketId,
    houseId: req.body.houseId,
    permitId: req.body.permitId,
    inspectionId: req.body.inspectionId,
    inspectorId: req.body.inspectorId
  }

  let list = await InspectionsModel.list(fields, req.db)
}

exports.search = async (req, res) => {
  return await InspectionsModel.search(query, req.db)
}

exports.searchInspectors = async (req, res) => {
  return await InspectionsModel.searchInspectors(query, req.db)
}
