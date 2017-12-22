import Model from '../Model'

exports.list = async (req) => {
  let sql = `
    SELECT * FROM ticket_types
    ORDER BY type
  `
  let bind = []

  return Model.query(sql, bind)
}

exports.retrieve = async (req) => {
  let sql = `
    SELECT * FROM ticket_types WHERE id = $1
  `
  let bind = [ req.id ]

  return Model.query(sql, bind, true)
}
