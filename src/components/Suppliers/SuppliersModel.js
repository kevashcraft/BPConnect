import * as Model from '../Model'

exports.create = async (req) => {
  let sql = `
    INSERT INTO suppliers (
      name, address, phone, email, fax, zipcode_id
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
  `
  let bind = [req.name, req.address, req.phone, req.email, req.fax, req.zipcodeId]

  console.log('bind', bind)
  return Model.query(sql, bind, true, true)
}

exports.list = async (req) => {
  let sql = `
    SELECT
      suppliers.id,
      suppliers.id as supplier_id,
      suppliers.created,
      suppliers.name,
      suppliers.phone,
      suppliers.fax,
      suppliers.address,
      suppliers.email,
      suppliers.zipcode_id,
      suppliers.deleted,
      locations.citystate
    FROM suppliers
    LEFT JOIN locations ON locations.zipcode_id = suppliers.zipcode_id
    WHERE suppliers.deleted = $1
  `
  let bind = [req.deleted]

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
      AND NOT suppliers.deleted
    ORDER BY similarity(suppliers.name, $1) DESC
    LIMIT 10
  `
  let bind = [req.query]

  return Model.query(sql, bind)
}

exports.update = async (id, fields) => {
  let update = Model.updateFields(fields)

  let sql = `
    UPDATE suppliers SET ${update.set}
    WHERE id = $${update.count + 1}
  `
  update.bind.push(id)

  Model.run(sql, update.bind)
}
