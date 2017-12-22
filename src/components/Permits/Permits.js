import PermitsModel from './PermitsModel'

exports.list = async (req) => {
  return PermitsModel.list(req)
}

exports.retrieve = async (req) => {
  let permitId = req.body.permitId
  return PermitsModel.retrieve(permitId, req.db)
}

exports.search = async (req) => {
  let query = req.body.query

  return PermitsModel.search(query, req.db)
}

exports.update = async (req) => {
  let permitId = req.permitId
  let fields = {
    name: req.name,
    starts: req.starts,
    ends: req.ends,
    inspector_id: req.inspectorId
  }

  await PermitsModel.update(permitId, fields)

  return true
}
