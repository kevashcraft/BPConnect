import * as SubdivisionsModel from './SubdivisionsModel'

exports.create = async (req) => {
  return SubdivisionsModel.create(req)
}

exports.delete = async (req) => {
  let fields = { deleted: true }
  await SubdivisionsModel.update(req.id, fields)

  return true
}

exports.list = async (req) => {
  req.deleted = !!req.deleted
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

exports.undelete = async (req) => {
  let fields = { deleted: false }
  await SubdivisionsModel.update(req.id, fields)

  return true
}

exports.update = async (req) => {
  let fields = {
    name: req.name,
    builder_id: req.builderId,
    zipcode_id: req.zipcodeId
  }
  await SubdivisionsModel.update(req.id, fields)

  return true
}
