import InspectorsModel from './InspectorsModel'

exports.create = async (req) => {
  return InspectorsModel.create(req)
}

exports.delete = async (req) => {
  let fields = { deleted: true }
  await InspectorsModel.update(req.id, fields)

  return true
}

exports.list = async (req) => {
  req.deleted = !!req.deleted
  return InspectorsModel.list(req)
}

exports.search = async (req) => {
  req.queryString = "'%" + req.query.replace(' ', "%', '%") + "%'"
  let results = await InspectorsModel.search(req)

  return {
    success: true,
    results
  }
}

exports.undelete = async (req) => {
  let fields = { deleted: false }
  await InspectorsModel.update(req.id, fields)

  return true
}

exports.update = async (req) => {
  let fields = {
    name: req.name,
    address: req.address,
    email: req.email,
    phone: req.phone,
    fax: req.fax,
    url: req.url,
    zipcode_id: req.zipcodeId
  }
  await InspectorsModel.update(req.id, fields)

  return true
}
