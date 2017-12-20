import * as Model from '../Model'

exports.list = async (req) => {
  let sql = `
    SELECT * FROM schedule_view
    WHERE ticket_date_scheduled >= $1
        AND ticket_date_scheduled <= $2
      AND ($3 = 0
        OR schedule_view.ticket_id = $3)
      AND ($4 = 0
        OR schedule_view.builder_id = $4)
      AND ($5 = 0
        OR schedule_view.subdivision_id = $5)
      AND ($6 = 0
        OR schedule_view.house_id = $6)
      AND ($7 = 0
        OR schedule_view.plumber_id = $7)
      AND ($8 = 0
        OR schedule_view.helper_id = $8)
    LIMIT 1000
  `
  let bind = [
    req.daterange[0], req.daterange[1],
    req.ticketId, req.builderId,
    req.subdivisionId, req.houseId,
    req.plumberId, req.helperId
  ]

  return await Model.query(sql, bind)
}

exports.retrieve = async (req) => {
  let sql = `
    SELECT * FROM schedule_view
    WHERE ticket_id = $1
  `
  let bind = [req.id]

  return await Model.query(sql, bind)
}

exports.search = async (req) => {
  let sql = `
    SELECT * FROM (
      SELECT
        'Subdivisions' as category,
        similarity(subdivisions.name, :query) as ord1,
        0 as ord2,
        subdivisions.id,
        subdivisions.name as title,
        'By ' || builders.name as description
      FROM subdivisions
      JOIN builders
        ON builders.id = subdivisions.builder_id
      WHERE subdivisions.name ILIKE ANY $query
      UNION
      SELECT
        'Tickets' as category,
        similarity(schedule_view.ticket_id::text, :query) as ord1,
        1 as ord2,
        schedule_view.ticket_id,
        '#' || schedule_view.ticket_id::text || ' lot ' || houses.lot as title,
        subdivisions.name || 'By ' || builders.name as description
      FROM schedule_view
      JOIN tickets
        ON tickets.id = schedule_view.ticket_id
      JOIN houses
        ON houses.id = tickets.house_id
      JOIN subdivisions
        ON subdivisions.id = houses.subdivision_id
      JOIN builders
        ON builders.id = subdivisions.builder_id
      WHERE schedule_view.ticket_id::text ILIKE ANY $query
        OR builders.name ILIKE ANY $query
        OR houses.lot ILIKE ANY $query
        OR houses.address ILIKE ANY $query
    ) search
    ORDER BY ord1 DESC, ord2 ASC
    LIMIT 10
  `
  let bind = [req.query]

  return await Model.query(sql, bind)
}

