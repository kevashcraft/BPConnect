import * as SuppliersModel from './SuppliersModel'

exports.create = async (req, res) => {
  return SuppliersModel.create(req)
}

exports.search = async (req) => {
  req.queryString = "'%" + req.query.replace(' ', "%', '%") + "%'"
  let results = await SuppliersModel.search(req)

  return {
    success: true,
    results
  }
}
