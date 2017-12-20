import * as SrcModel from './SrcModel'

exports.list = async (req) => {

  return await SrcModel.list(req)
}

exports.retrieve = async (req) => {
  let ticketId = req.body.ticketId
  return await SrcModel.retrieve(ticketId, req.db)
}

exports.search = async (req) => {
  let query = req.body.query
  return await SrcModel.search(query, req.db)
}

exports.update = async (req) => {
  let site = req.body.site
  site.ready = site.ready ? 'NOW()' : null

  return SrcModel.update(site, req.db)
}
