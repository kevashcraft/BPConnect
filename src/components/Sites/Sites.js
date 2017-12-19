import * as SitesModel from './SitesModel'

exports.list = async (req, res) => {
  let fields = {
    drstart: req.body.daterange[0],
    drend: req.body.daterange[1],
    ticketId: req.body.ticketId,
    subdivisionId: req.body.subdivisionId,
    houseId: req.body.houseId,
  }

  return SitesModel.list(fields, req.db)
}

exports.retrieve = async (req, res) => {
  let ticketId = req.body.ticketId
  return await SitesModel.retrieve(ticketId, req.db)
}

exports.search = async (req, res) => {
  let query = req.body.query
  return await SitesModel.search(query, req.db)
}

exports.update = async (req, res) => {
  let site = req.body.site
  site.ready = site.ready ? 'NOW()' : null

  return SitesModel.update(site, req.db)
}
