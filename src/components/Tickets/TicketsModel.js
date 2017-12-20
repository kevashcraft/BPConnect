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

  return await Model.query(sql, bind, true, true)

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
    req.ticketId, req.builderId,
    req.subdivisionId, req.houseId
  ]

  return await Model.query(sql, bind)
}

exports.retrieve = async (req) => {
  let sql = `
    SELECT * FROM tickets_view
    WHERE ticket_id = $1
  `
  let bind = [ req.id ]

  return await Model.query(sql, bind, true)
}

exports.search = async (req) => {
  let sql = `
    SELECT * FROM (
      SELECT
        'Tickets' as category,
        similarity(tickets.id::text, :query) as ord1,
        0 as ord2,
        tickets.id,
        tickets.id::text as title,
        subdivisions.name || ' lot ' || houses.lot as description
      FROM tickets
      JOIN houses
        ON houses.id = tickets.house_id
      JOIN subdivisions
        ON subdivisions.id = houses.subdivision_id
      WHERE tickets.id::text ILIKE ANY $query
      UNION
      SELECT
        'Builders' as category,
        similarity(builders.name, :query) as ord1,
        1 as ord2,
        builders.id,
        builders.name as title,
        ''::text as description
      FROM builders
      WHERE builders.name ILIKE ANY $query
      UNION
      SELECT
        'Subdivisions' as category,
        similarity(builders.name || ' ' || subdivisions.name, :query) as ord1,
        2 as ord2,
        subdivisions.id,
        subdivisions.name as title,
        'By ' || builders.name as description
      FROM subdivisions
      JOIN builders
        ON builders.id = subdivisions.builder_id
      WHERE subdivisions.name ILIKE ANY $query
        OR builders.name ILIKE ANY $query
      UNION ALL
      SELECT
        'Lots' as category,
        similarity(builders.name || ' ' || subdivisions.name || ' ' || houses.lot, :query) as ord1,
        3 as ord2,
        houses.id,
        subdivisions.name || ' lot ' || houses.lot as title,
        'By ' || builders.name as description
      FROM houses
      JOIN subdivisions
        ON subdivisions.id = houses.subdivision_id
      JOIN builders
        ON builders.id = subdivisions.builder_id
      WHERE builders.name ILIKE ANY $query
        OR subdivisions.name ILIKE ANY $query
        OR houses.lot ILIKE ANY $query
        OR houses.address ILIKE ANY $query
    ) search
    ORDER BY ord1 DESC, ord2 ASC
    LIMIT 10
  `

  let bind = [ req.query ]

  return await Model.query(sql, bind)
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