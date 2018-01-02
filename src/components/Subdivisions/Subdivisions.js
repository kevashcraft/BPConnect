import Model from '../Model'
import * as Subdivisions from './SubdivisionsModel'

exports.create = async (req) => {
  return Subdivisions.create(req)
}

exports.search = async (req) => {
  req.queryString = "'%" + req.query.replace(' ', "%', '%") + "%'"
  let results = await Subdivisions.search(req)

  return {
    success: true,
    results
  }
}
