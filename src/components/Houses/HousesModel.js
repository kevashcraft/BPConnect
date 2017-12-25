import Model from '../Model'

exports.create = async (req) => {
  let sql = `
    INSERT INTO houses (subdivision_id, lot, address)
    VALUES ($1, $2, $3)
    RETURNING id
  `
  let bind = [req.subdivisionId, req.lot, req.address]

  return Model.query(sql, bind)
}

exports.retrievePermits = async (req) => {
  let sql = `
    SELECT * FROM permits
    WHERE house_id = $1
    ORDER BY created DESC
  `
  let bind = [ req.houseId ]

  return Model.query(sql, bind)
}

exports.search = async (req) => {
  let sql = `
    SELECT
      houses.id,
      houses.lot  || ' ' || coalesce(houses.address, '') as title,
      subdivisions.name
        || ' by ' || builders.name
        || ' in ' || locations.city as description,
      houses.id as house_id,
      houses.lot as house_lot,
      subdivisions.id as subdivision_id,
      subdivisions.name as subdivision_name,
      subdivisions.zipcode_id as subdivision_zipcod_id,
      builders.id as builder_id,
      builders.name as builder_name
    FROM houses
    JOIN subdivisions ON subdivisions.id = houses.subdivision_id
    JOIN locations ON locations.zipcode_id = subdivisions.zipcode_id
    JOIN builders ON builders.id = subdivisions.builder_id
    WHERE
      houses.lot ilike ANY(ARRAY[${req.queryString}])
      OR builders.name ilike ANY(ARRAY[${req.queryString}])
      OR subdivisions.name ilike ANY(ARRAY[${req.queryString}])
    ORDER BY
      similarity(houses.lot
        || ' ' || houses.address
        || ' ' || subdivisions.name
        || ' ' || builders.name
        || ' ' || locations.city
      , $1) DESC
    LIMIT 10
  `
  let bind = [req.query]

  return Model.query(sql, bind)
}
