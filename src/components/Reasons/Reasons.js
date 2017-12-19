import * as ReasonsModel from './ReasonsModel'

exports.create = async (req, res) => {
  let reason = req.body.reason
  return ReasonsModel.create(reason, req.db)
}

exports.search = async (req, res) => {
  let query = req.body.query
  return ReasonsModel.search(query, req.db)
}
