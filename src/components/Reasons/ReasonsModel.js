import * as Model from '../Model'

exports.create = async (req) => {
  let sql = `
    INSERT INTO reasons (
      reason, fault
    ) VALUES ($1, $2)
    RETURNING id
  `
  let bind = [ req.reason, req.fault ]

  return Model.query(sql, bind, true, true)
}

exports.search = async (req) => {
  let sql = `
    SELECT
      reasons.id,
      reasons.reason as title
    FROM reasons
    WHERE reasons.reason ilike ANY(ARRAY[${req.queryString}])
    ORDER BY similarity(reasons.reason, $1) DESC
    LIMIT 10
  `
  let bind = [req.query]

  return Model.query(sql, bind)
}
