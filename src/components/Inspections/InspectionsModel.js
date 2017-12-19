import Model from '../Model'

exports.create = async (rea, db) => {
  let sql = `
    INSERT INTO inspections (ticket_id, permit_id)
    VALUES ($1, $2)
    RETURNING id
  `
  let bind = [rea.ticketId, rea.permitId]

  return await Model.query(sql, bind)
}

exports.list = async (req, db) => {
  let sql = `
    SELECT * FROM inspections_view
    WHERE
      ((permit_date_starts >= $1
          AND permit_date_starts <= $2)
        OR (permit_date_ends >= $1
          AND permit_date_ends <= $2)
        OR (inspection_date_scheduled >= $1
          AND inspection_date_scheduled <= $2)
        OR (ticket_date_created >= $1
          AND ticket_date_created <= $2)
        OR (ticket_date_scheduled >= $1
          AND ticket_date_scheduled <= $2))
      AND ($3 = 0
        OR inspections_view.ticket_id = $3)
      AND ($4 = 0
        OR inspections_view.permit_id = $4)
      AND ($5 = 0
        OR inspections_view.inspection_id = $5)
      AND ($6 = 0
        OR inspections_view.inspector_id = $6)
      AND ($7 = 0
        OR inspections_view.house_id = $7)
      LIMIT 1000
  `
  let bind = [
    req.drstart, req.drend,
    req.ticketId, req.permitId,
    req.inspectionId, req.inspectorId,
    req.houseId
  ]

  return await Model.query(sql, bind)
}

exports.retrieve = async (req) => {
  let sql = `
    SELECT * FROM inspections_view
    WHERE inspection_id = $1
  `
  let bind = [req.id]

  return Model.query(sql, bind)
}

exports.search = async (query, db) => {
  let sql = `
    SELECT * FROM (
      SELECT
        'Permits' as category,
        similarity(permits.name, :query) as ord1,
        0 as ord2,
        permits.id,
        permits.name as title,
        'From ' || inspectors.name as description
      FROM permits
      JOIN inspectors
        ON inspectors.id = permits.inspector_id
      WHERE permits.name ILIKE ANY $query
      UNION
      SELECT
        'Tickets' as category,
        similarity(orders_view.ticket_id::text, :query) as ord1,
        1 as ord2,
        orders_view.ticket_id,
        '#' || orders_view.ticket_id::text || ' lot ' || houses.lot as title,
        subdivisions.name || 'By ' || builders.name as description
      FROM orders_view
      JOIN tickets
        ON tickets.id = orders_view.ticket_id
      JOIN houses
        ON houses.id = tickets.house_id
      JOIN subdivisions
        ON subdivisions.id = houses.subdivision_id
      JOIN builders
        ON builders.id = subdivisions.builder_id
      WHERE orders_view.ticket_id::text ILIKE ANY $query
        OR builders.name ILIKE ANY $query
        OR houses.lot ILIKE ANY $query
        OR houses.address ILIKE ANY $query
      UNION ALL
      SELECT
        'Inspectors' as category,
        similarity(inspectors.name, :query) as ord1,
        2 as ord2,
        inspectors.id,
        inspectors.name as title,
        '' as description
      FROM inspectors
      WHERE inspectors.name ILIKE ANY $query
    ) search
    ORDER BY ord1 DESC, ord2 ASC
    LIMIT 10
  `
  let bind = [req.query]

  return await Model.query(sql, bind)
}

exports.searchInspectors = async (req) => {
  let sql = `
    SELECT
      inspectors.id,
      inspectors.name as title
    FROM inspectors
    WHERE name ILIKE '%' || :query || '%'
  `
  let bind = [req.query]

  return await Model.query(sql, bind)
}
