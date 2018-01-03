import * as SubdivisionsModel from './SubdivisionsModel'

exports.create = async (req) => {
  return SubdivisionsModel.create(req)
}

exports.list = async (req) => {
  return SubdivisionsModel.list(req)
}

exports.search = async (req) => {
  req.queryString = "'%" + req.query.replace(' ', "%', '%") + "%'"
  let results = await SubdivisionsModel.search(req)

  return {
    success: true,
    results
  }
}

exports.update = async (req) => {
  let fields = {
    name: req.name
  }
  await SubdivisionsModel.update(req.id, fields)

  return true
}
