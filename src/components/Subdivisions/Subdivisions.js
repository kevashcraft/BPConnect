import * as Subdivisions from './SubdivisionsModel'

exports.search = async (req) => {
  req.queryString = "'%" + req.query.replace(' ', "%', '%") + "%'"
  let results = await Subdivisions.search(req)

  return {
    success: true,
    results
  }
}
