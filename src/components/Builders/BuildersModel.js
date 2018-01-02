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

exports.search = async (req) => {
  let sql = `
    SELECT
      builders.id,
      builders.name as title
    FROM builders
    WHERE builders.name ilike ANY(ARRAY[${req.queryString}])
    ORDER BY similarity(builders.name, $1) DESC
    LIMIT 10
  `
  let bind = [req.query]

  return Model.query(sql, bind)
}
