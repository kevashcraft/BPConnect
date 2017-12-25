import * as Common from '../Common/Common'
import * as SrcModel from './SrcModel'

exports.list = async (req) => {
  return SrcModel.list(req)
}

exports.retrieve = async (req) => {
  let ticketId = req.body.ticketId
  return SrcModel.retrieve(ticketId, req.db)
}

exports.search = async (req) => {
  let categories = ['Tickets', 'Builders', 'Subdivisions', 'Lots', 'Orders']
  return Common.searchCategories(req, categories)
}

exports.update = async (req) => {
  let ticketId = req.ticketId
  let fields = { ready: { safe: req.ready ? 'current_timestamp' : 'NULL' } }

  await SrcModel.update(ticketId, fields)

  return true
}
