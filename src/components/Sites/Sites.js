import * as SitesModel from './SitesModel'

exports.list = async (req) => {

  return await SitesModel.list(req)
}

exports.retrieve = async (req) => {
  let ticketId = req.body.ticketId
  return await SitesModel.retrieve(ticketId, req.db)
}

exports.search = async (req) => {
  let query = req.body.query
  return await SitesModel.search(query, req.db)
}

exports.update = async (req) => {
  let site = req.body.site
  site.ready = site.ready ? 'NOW()' : null

  return SitesModel.update(site, req.db)
}
