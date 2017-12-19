import Model from '../Model'

exports.create = async (req) => {
  let sql = `
    INSERT INTO builders (name, phone)
    VALUES ($1, $2)
    RETURNING id
  `
  let bind = [req.name, req.phone]
  return await Model.query(sql, bind)
}

exports.search = async (req) => {
  let sql = `
    SELECT
      zipcode_id as id,
      city as title,
      location as description
    FROM locations
    WHERE locations.location ilike ANY(ARRAY[${req.queryString}])
      AND state = 'Florida'
    ORDER BY similarity(location, $1) DESC
    LIMIT 10
  `
  let bind = [req.query]

  return await Model.query(sql, bind)
}
