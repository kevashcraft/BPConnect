import InspectionsModel from './InspectionsModel'

exports.schedule = async (req) => {
  let inspectionId = req.body.inspectionId
  let fields = { scheduled: req.body.scheduled }
  return await InspectionsModel.update(inspectionId, fields)
}

exports.pass = async (req) => {
  let inspectionId = req.body.inspectionId
  let fields = { passed: req.body.passed }
  return await InspectionsModel.update(inspectionId, fields)
}

exports.fail = async (req) => {
  let inspectionId = req.body.inspectionId
  let fields = { failed: req.body.failed }
  return await InspectionsModel.update(inspectionId, fields)
}

exports.list = async (req) => {
  return await InspectionsModel.list(req)
}

exports.search = async (req) => {
  return await InspectionsModel.search(query, req.db)
}

exports.searchInspectors = async (req) => {
  req.queryString = "'%" + req.query.replace(' ', "%', '%") + "%'"
  let results = await InspectionsModel.searchInspectors(req)

  return {
    success: true,
    results
  }
}
