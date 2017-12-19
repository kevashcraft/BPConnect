import Model from '../Model'

exports.list = async (req) => {
  let sql = `
    SELECT * FROM wip_view
    WHERE
      ((ticket_date_started >= $1
          AND ticket_date_started <= $2)
        OR (ticket_date_completed >= $1
          AND ticket_date_completed <= $2)
        OR (ticket_date_walked >= $1
          AND ticket_date_walked <= $2)
        OR (ticket_date_created >= $1
          AND ticket_date_created <= $2)
        OR (ticket_date_scheduled >= $1
          AND ticket_date_scheduled <= $2))
      AND (:ticket_id = 0
        OR wip_view.ticket_id = $3)
      AND (:house_id = 0
        OR wip_view.house_id = $4)
    LIMIT 5000
  `
  let bind = [req.drstart, req.drend, req.ticketId, req.houseId]

  return await Model.query(sql, bind)
}

exports.search = async (req) => {
  let sql = `
    SELECT * FROM (
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
    ) search
    ORDER BY ord1 DESC, ord2 ASC
    LIMIT 10
  `
  let bind = [ req.query ]

  return await Model.query(sql, bind)
}
