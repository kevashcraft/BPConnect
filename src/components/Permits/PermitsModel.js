import Model from '../Model'

exports.create = async (req) => {
  let sql = `
    INSERT INTO permits (house_id)
    VALUES ($1)
    RETURNING id
  `
  let bind = [req.houseId]

  return Model.query(sql, bind, true, true)
}

exports.countForHouseId = async (req) => {
  let sql = `
    SELECT count(*) FROM permits
    WHERE house_id = $1
      AND permits.starts <= current_date
      AND permits.ends >= current_date
  `
  let bind = [req.id]

  return parseInt(Model.query(sql, bind, true, true))
}

exports.list = async (req) => {
  let sql = `
    SELECT * FROM permits_view
    WHERE
      ((permit_date_starts >= $1
          AND permit_date_starts <= $2)
        OR (permit_date_ends >= $1
          AND permit_date_ends <= $2)
        OR (ticket_date_created >= $1
          AND ticket_date_created <= $2)
        OR (ticket_date_scheduled >= $1
          AND ticket_date_scheduled <= $2))
      AND ($3 = 0
        OR permits_view.permit_id = $3)
      AND ($4 = 0
        OR permits_view.ticket_id = $4)
      AND ($5 = 0
        OR permits_view.inspector_id = $5)
      AND ($6 = 0
        OR permits_view.house_id = $6)
  `
  let bind = [
    req.daterange[0], req.daterange[1],
    req.permitId.value, req.ticketId.value,
    req.inspectorId.value, req.houseId.value
  ]

  return Model.query(sql, bind)
}

exports.retrieve = async (req) => {
  let sql = `
    SELECT * FROM permits_view
    WHERE permit_id = $1
  `
  let bind = [req.id]

  return Model.query(sql, bind)
}

exports.update = async (id, fields) => {
  let update = Model.updateFields(fields)

  let sql = `
    UPDATE permits SET ${update.set}
    WHERE id = $${update.count + 1}
  `
  update.bind.push(id)

  Model.run(sql, update.bind)
}
