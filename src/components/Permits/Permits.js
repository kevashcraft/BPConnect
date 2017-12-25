import * as Common from '../Common/Common'
import PermitsModel from './PermitsModel'

exports.list = async (req) => {
  return PermitsModel.list(req)
}

exports.retrieve = async (req) => {
  let permitId = req.body.permitId
  return PermitsModel.retrieve(permitId, req.db)
}

exports.search = async (req) => {
  let categories = ['Tickets', 'Builders', 'Subdivisions', 'Lots', 'Orders']
  return Common.searchCategories(req, categories)
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
