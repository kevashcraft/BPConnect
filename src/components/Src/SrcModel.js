import * as Model from '../Model'

exports.list = async (req) => {
  let sql = `
    SELECT * FROM sites_view
    WHERE ticket_date_scheduled >= $1
        AND ticket_date_scheduled <= $2
      AND ($3 = 0
        OR sites_view.ticket_id = $3)
      AND ($4 = 0
        OR sites_view.subdivision_id = $4)
      AND ($5 = 0
        OR sites_view.house_id = $5)
  `
  let bind = [
    req.daterange[0], req.daterange[1],
    req.ticketId.value, req.subdivisionId.value, req.houseId.value
  ]

  return Model.query(sql, bind)
}

exports.retrieve = async (req) => {
  let sql = `
    SELECT * FROM sites_view
    WHERE ticket_id = $1
  `
  let bind = [ req.id ]

  return Model.query(sql, bind)
}

exports.update = async (id, fields) => {
  let update = Model.updateFields(fields)

  let sql = `
    UPDATE tickets SET ${update.set}
    WHERE id = $${update.count + 1}
  `
  update.bind.push(id)

  Model.run(sql, update.bind)
}
