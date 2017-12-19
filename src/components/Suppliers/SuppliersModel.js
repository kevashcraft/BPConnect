import * as Model from '../Model'

exports.create = async (req) => {
  let sql = `
    INSERT INTO suppliers (
      name, address, phone
    ) VALUES ($1, $2, $3)
    RETURNING id
  `
  let bind = [req.name, req.address, req.phone]

  return await Model.query(sql, bind)
}

exports.search = async (req) => {
  let sql = `
    SELECT
      suppliers.id,
      suppliers.name as title
    FROM suppliers
    WHERE name ILIKE '%' || $1 || '%'
  `
  let bind = [ req.query ]

  return await Model.query(sql, bind)
}
