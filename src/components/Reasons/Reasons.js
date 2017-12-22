import * as ReasonsModel from './ReasonsModel'

exports.create = async (req) => {
  return ReasonsModel.create(req)
}

exports.search = async (req) => {
  req.queryString = "'%" + req.query.replace(' ', "%', '%") + "%'"
  let results = await ReasonsModel.search(req)

  return {
    success: true,
    results
  }
}
