import Model from '../Model'

exports.create = async (req) => {
  let sql = `
    INSERT INTO subdivisions (builder_id, name, zip_id)
    VALUES ($1, $2, $3)
    RETURNING id
  `
  let bind = [subdivision.builderId, subdivision.name, subdivision.zipId]

  return await Model.query(sql, bind)
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
    JOIN locations ON locations.zipcode_id = subdivisions.zipcode_id
    JOIN builders ON builders.id = subdivisions.builder_id
    WHERE subdivisions.name ilike ANY(ARRAY[${req.queryString}])
    ORDER BY similarity(subdivisions.name || ' ' || builders.name, $1) DESC
    LIMIT 10
  `
  let bind = [req.query]

  return await Model.query(sql, bind)
}
