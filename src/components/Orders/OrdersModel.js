import Model from '../Model'

exports.create = async (req) => {
  let sql = `
    INSERT INTO orders (
      name, supplier_id, total, ordered
    ) VALUES ($1, $2, $3, $4)
    RETURNING id
  `
  let bind = [
    req.number, req.supplierId,
    req.total, req.ordered
  ]

  return await Model.query(sql, bind)
}

exports.list = async (req) => {
  let sql = `
    SELECT * FROM orders_view
    WHERE
      ((date_ordered >= $1
          AND date_ordered <= $2)
        OR (ticket_date_scheduled >= $1
          AND ticket_date_scheduled <= $2))
      AND ($3 = 0
        OR orders_view.order_id = $3)
      AND ($4 = 0
        OR orders_view.ticket_id = $4)
      AND ($5 = 0
        OR orders_view.supplier_id = $5)
    LIMIT 1000
  `
  let bind = [
    req.drstart, req.drend,
    req.orderId, req.ticketId, req.supplierId
  ]

  return await Model.query(sql, bind)
}

exports.retrieve = async (req) => {
  let sql = `
    SELECT * FROM orders_view
    WHERE order_id = $1
  `
  let bind = [req.id]

  return await Model.query(sql, bind)
}

exports.search = async (req) => {
  let sql = `
    SELECT * FROM (
      SELECT
        'Orders' as category,
        similarity(orders.name, :query) as ord1,
        0 as ord2,
        orders.id,
        orders.name as title,
        'Purchased ' || to_char(orders.created, 'MM/DD/YY') || ' from ' || suppliers.name as description
      FROM orders
      JOIN suppliers
        ON suppliers.id = orders.supplier_id
      WHERE orders.name ILIKE ANY $query
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
        'Suppliers' as category,
        similarity(suppliers.name, :query) as ord1,
        2 as ord2,
        suppliers.id,
        suppliers.name as title,
        '' as description
      FROM suppliers
      WHERE suppliers.name ILIKE ANY $query
    ) search
    ORDER BY ord1 DESC, ord2 ASC
    LIMIT 10
  `
  let bind = [req.query]

  return await Model.query(sql, bind)
}
