import * as Model from '../Model'

exports.create = async (req) => {
  let sql = `
    INSERT INTO reasons (
      reason, fault
    ) VALUES ($1, $2)
    RETURNING id
  `
  let bind = [ req.reason, req.fault ]

  return await Model.query(sql, bind)
}

exports.search = async (req) => {
  let sql = `
    SELECT
      reasons.id,
      reasons.reason as title
    FROM reasons
    WHERE reason ILIKE '%' || :query || '%'
  `
  let bind = [ req.query ]

  return await Model.query(sql, bind)
}
