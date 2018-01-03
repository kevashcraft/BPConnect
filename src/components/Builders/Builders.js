import * as BuildersModel from './BuildersModel'

exports.list = async (req) => {
  return BuildersModel.list()
}

exports.search = async (req) => {
  req.queryString = "'%" + req.query.replace(' ', "%', '%") + "%'"
  let results = await BuildersModel.search(req)

  return {
    success: true,
    results
  }
}
