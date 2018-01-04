import Model from '../Model'

exports.create = async (req) => {
  let sql = `
    INSERT INTO builders (name, phone, email, address, zipcode_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `
  let bind = [req.name, req.phone, req.email, req.address, req.zipcodeId]
  return Model.query(sql, bind, true, true)
}

exports.list = async (req) => {
  let sql = `
    SELECT
      builders.id,
      builders.id as builder_id,
      builders.name,
      builders.email,
      builders.phone,
      builders.address,
      builders.deleted,
      locations.citystate
    FROM builders
    LEFT JOIN locations ON locations.zipcode_id = builders.zipcode_id
    WHERE builders.deleted = $1
  `
  let bind = [req.deleted]

  return Model.query(sql, bind)
}

exports.search = async (req) => {
  let sql = `
    SELECT
      builders.id,
      builders.name as title
    FROM builders
    WHERE builders.name ilike ANY(ARRAY[${req.queryString}])
      AND NOT builders.deleted
    ORDER BY similarity(builders.name, $1) DESC
    LIMIT 10
  `
  let bind = [req.query]

  return Model.query(sql, bind)
}

exports.update = async (id, fields) => {
  console.log('fields', fields)
  let update = Model.updateFields(fields)
  console.log('update', update)

  let sql = `
    UPDATE builders SET ${update.set}
    WHERE id = $${update.count + 1}
  `
  update.bind.push(id)

  Model.run(sql, update.bind)
}
