import * as BuildersModel from './BuildersModel'

exports.create = async (req) => {
  return BuildersModel.create(req)
}

exports.delete = async (req) => {
  let fields = { deleted: true }
  await BuildersModel.update(req.id, fields)

  return true
}

exports.list = async (req) => {
  req.deleted = !!req.deleted
  return BuildersModel.list(req)
}

exports.search = async (req) => {
  req.queryString = "'%" + req.query.replace(' ', "%', '%") + "%'"
  let results = await BuildersModel.search(req)

  return {
    success: true,
    results
  }
}

exports.undelete = async (req) => {
  let fields = { deleted: false }
  await BuildersModel.update(req.id, fields)

  return true
}

exports.update = async (req) => {
  let fields = {
    name: req.name,
    address: req.address,
    email: req.email,
    phone: req.phone,
    zipcode_id: req.zipcodeId
  }
  await BuildersModel.update(req.id, fields)

  return true
}
