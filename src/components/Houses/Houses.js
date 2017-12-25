import HousesModel from './HousesModel'

exports.retrievePermits = async (req) => {
  return HousesModel.retrievePermits(req)
}

exports.search = async (req) => {
  req.queryString = "'%" + req.query.replace(' ', "%', '%") + "%'"
  let results = await HousesModel.search(req)

  return {
    success: true,
    results
  }
}
