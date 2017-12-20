import PermitsModel from './PermitsModel'

exports.list = async (req) => {

  return await PermitsModel.list(req)
}

exports.retrieve = async (req) => {
  let permitId = req.body.permitId
  return await PermitsModel.retrieve(permitId, req.db)
}

exports.search = async (req) => {
  let query = req.body.query

  return await PermitsModel.search(query, req.db)
}

exports.update = async (req) => {
  let permitId = req.body.permitId
  let fields = {
    name: req.body.name,
    starts: req.body.starts,
    ends: req.body.ends,
    inspectorId: req.body.inspectorId,
  }

  return await PermitsModel.update(permitId, fields, req.db)
}
