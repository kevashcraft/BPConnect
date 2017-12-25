import * as Model from '../Model'

exports.create = async (req) => {
  let sql = `
    INSERT INTO ticket_workers (ticket_id, user_id, type)
    VALUES ($1, $2, $3)
  `

  let bind = [req.ticketId, req.userId, req.type]

  return Model.run(sql, bind)
}

exports.delete = async (req) => {
  let sql = `
    DELETE FROM ticket_workers
    WHERE ticket_id = $1
  `
  let bind = [req.ticketId]

  return Model.run(sql, bind)
}

exports.retrieve = async (req) => {
  let sql = `
    SELECT
      users.id as user_id,
      workers.type,
      users.fname || ' ' || users.lname as name
    FROM ticket_workers
    JOIN users ON users.id = ticket_workers.user_id
    JOIN workers ON workers.user_id = users.id
    WHERE ticket_workers.ticket_id = $1
  `
  let bind = [req.ticketId]

  return Model.query(sql, bind)
}
