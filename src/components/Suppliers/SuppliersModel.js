import * as Model from '../Model'

exports.create = async (req) => {
  let sql = `
    INSERT INTO suppliers (
      name, address, phone
    ) VALUES ($1, $2, $3)
    RETURNING id
  `
  let bind = [req.name, req.address, req.phone]

  return Model.query(sql, bind)
}

exports.search = async (req) => {
  let sql = `
    SELECT
      suppliers.id,
      suppliers.name as title,
      coalesce(locations.citystate, '') as description
    FROM suppliers
    LEFT JOIN locations ON locations.zipcode_id = suppliers.zipcode_id
    WHERE suppliers.name ilike ANY(ARRAY[${req.queryString}])
    ORDER BY similarity(suppliers.name, $1) DESC
    LIMIT 10
  `
  let bind = [req.query]

  return Model.query(sql, bind)
}
