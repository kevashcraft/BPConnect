import Model from '../Model'

exports.create = async (req) => {
  let sql = `
    INSERT INTO subdivisions (builder_id, name, zipcode_id)
    VALUES ($1, $2, $3)
    RETURNING id
  `
  let bind = [req.builderId, req.name, req.zipcodeId]
  console.log('bind', bind)

  return Model.query(sql, bind, true, true)
}

exports.list = async (req) => {
  let sql = `
    SELECT
      subdivisions.id,
      subdivisions.id as subdivision_id,
      subdivisions.created,
      subdivisions.name,
      subdivisions.deleted,
      subdivisions.builder_id,
      subdivisions.zipcode_id,
      builders.name as builder,
      locations.citystate
    FROM subdivisions
    JOIN builders ON builders.id = subdivisions.builder_id
    JOIN locations ON locations.zipcode_id = subdivisions.zipcode_id
    WHERE subdivisions.deleted = $1
  `
  let bind = [req.deleted]

  return Model.query(sql, bind)
}

exports.search = async (req) => {
  let sql = `
    SELECT
      subdivisions.name as title,
      'By ' || builders.name || ' in ' || locations.citystate as description,
      subdivisions.id,
      subdivisions.id as subdivision_id,
      subdivisions.name as subdivision_name,
      builders.id as builder_id,
      builders.name as builder_name,
      locations.*
    FROM subdivisions
    LEFT JOIN locations ON locations.zipcode_id = subdivisions.zipcode_id
    LEFT JOIN builders ON builders.id = subdivisions.builder_id
    WHERE subdivisions.name ilike ANY(ARRAY[${req.queryString}])
      AND NOT subdivisions.deleted
    ORDER BY similarity(subdivisions.name || ' ' || builders.name, $1) DESC
    LIMIT 10
  `
  let bind = [req.query]

  return Model.query(sql, bind)
}

exports.update = async (id, fields) => {
  let update = Model.updateFields(fields)

  let sql = `
    UPDATE subdivisions SET ${update.set}
    WHERE id = $${update.count + 1}
  `
  update.bind.push(id)

  Model.run(sql, update.bind)
}
