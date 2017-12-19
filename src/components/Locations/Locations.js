import * as Locations from './LocationsModel'

exports.list = async (req) => {
  return Locations.list()
}

exports.retrieve = async (req) => {
  return TicketsModel.retrieve(req)
}

exports.search = async (req) => {
  req.queryString = "'%" + req.query.replace(' ', "%', '%") + "%'"
  let results = await Locations.search(req)

  return {
    success: true,
    results
  }
}
