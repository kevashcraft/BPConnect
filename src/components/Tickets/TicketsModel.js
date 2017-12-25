import Model from '../Model'

exports.create = async (req) => {
  let sql = `
    INSERT INTO tickets (
      ticket_type_id, house_id, scheduled, bp_supervisor_id, builder_supervisor_id, needspermit, needspo
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7
    )
    RETURNING id
  `
  let bind = [
    req.ticketTypeId,
    req.houseId,
    req.ticketDate,
    req.supervisorId,
    req.builderSupervisorId,
    req.needspermit,
    req.needspo
  ]

  return Model.query(sql, bind, true, true)
}

exports.list = async (req) => {
  let sql = `
    SELECT * FROM tickets_view
    WHERE ticket_date_scheduled >= $1
      AND ticket_date_scheduled <= $2
      AND (
        $3 = 0
        OR tickets_view.ticket_id = $3
      ) AND (
        $4 = 0
        OR tickets_view.builder_id = $4
      ) AND (
        $5 = 0
        OR tickets_view.subdivision_id = $5
      ) AND (
        $6 = 0
        OR tickets_view.house_id = $6
      )
    LIMIT 1000
  `
  let bind = [
    req.daterange[0], req.daterange[1],
    req.ticketId.value, req.builderId.value,
    req.subdivisionId.value, req.houseId.value
  ]
  console.log('bind', bind)

  return Model.query(sql, bind)
}

exports.retrieve = async (req) => {
  let sql = `
    SELECT * FROM tickets_view
    WHERE ticket_id = $1
  `
  let bind = [ req.id ]

  return Model.query(sql, bind, true)
}

exports.retrieveParts = async (req) => {
  let sql = `
    SELECT ticket_parts.*, false as ordered
    FROM ticket_parts
    WHERE ticket_id = $1
      AND order_id IS NULL
      AND NOT deleted
  `
  let bind = [ req.ticketId ]

  return Model.query(sql, bind)
}

exports.update = async (id, fields) => {
  let update = Model.updateFields(fields)

  let sql = `
    UPDATE tickets SET ${update.set}::timestamp
    WHERE id = $1
  `
  update.bind.push(id)

  Model.run(sql, update.bind)
}
