import * as SuppliersModel from './SuppliersModel'

exports.create = async (req, res) => {
  let supplier = req.body.supplier
  let supplierId = await SuppliersModel.create(supplier, req.db)
}

exports.search = async (req, res) => {
  let query = req.body.query
  return await SuppliersModel.search(query, req.db)
}
