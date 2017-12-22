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

  return Model.query(sql, bind, true, true)
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
    req.permitId, req.ticketId,
    req.inspectorId, req.houseId
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

exports.search = async (query) => {
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
  let bind = [query]

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
