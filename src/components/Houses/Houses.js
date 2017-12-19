import Houses from './HousesModel'

exports.search = async (req) => {
  req.queryString = "'%" + req.query.replace(' ', "%', '%") + "%'"
  let results = await Houses.search(req)

  return {
    success: true,
    results
  }
}

