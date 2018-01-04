import * as BuildersModel from './BuildersModel'

exports.list = async (req) => {
  req.deleted = !!req.deleted
  return BuildersModel.list(req)
}

exports.search = async (req) => {
  req.queryString = "'%" + req.query.replace(' ', "%', '%") + "%'"
  let results = await BuildersModel.search(req)

  return {
    success: true,
    results
  }
}
