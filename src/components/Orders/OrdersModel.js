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

  return Model.query(sql, bind, true, true)
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
    req.daterange[0], req.daterange[1],
    req.orderId.value, req.ticketId.value, req.supplierId.value
  ]

  return Model.query(sql, bind)
}

exports.retrieve = async (req) => {
  let sql = `
    SELECT * FROM orders_view
    WHERE order_id = $1
  `
  let bind = [req.id]

  return Model.query(sql, bind)
}

exports.retrieveParts = async (req) => {
  let sql = `
    SELECT ticket_parts.*, false as retrieved
    FROM ticket_parts
    WHERE order_id = $1
  `
  let bind = [ req.orderId ]

  return Model.query(sql, bind)
}
