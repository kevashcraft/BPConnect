import Model from '../Model'

exports.create = async (req) => {
  let sql = `
    INSERT INTO builder_supervisors (builder_id, name, phone)
    VALUES ($1, $2, $3)
    RETURNING id
  `
  let bind = [req.builderId, req.name, req.phone]

  return await Model.query(sql, bind)
}

exports.list = async (req) => {
  let sql = `
    SELECT * FROM builder_supervisors
    WHERE active
    ORDER BY name
  `
  let bind = []

  return await Model.query(sql, bind)
}