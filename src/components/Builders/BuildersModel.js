import Model from '../Model'

exports.create = async (req) => {
  let sql = `
    INSERT INTO builders (name, phone)
    VALUES ($1, $2)
    RETURNING id
  `
  let bind = [req.name, req.phone]
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
