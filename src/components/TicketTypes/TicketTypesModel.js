import Model from '../Model'

exports.list = async (req) => {
  let sql = `
    SELECT * FROM ticket_types
  `
  let bind = []

  return await Model.query(sql, bind)
}

exports.retrieve = async (req) => {
  let sql = `
    SELECT * FROM ticket_types WHERE id = $1
  `
  let bind = [ req.id ]

  return await Model.query(sql, bind, true)
}

