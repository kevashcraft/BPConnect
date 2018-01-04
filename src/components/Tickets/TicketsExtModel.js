import Model from '../Model'

/* WORKERS WORKERS WORKERS WORKERS */

exports.createWorker = async (req) => {
  let sql = `
    INSERT INTO ticket_workers (
      ticket_id, user_id, type
    ) VALUES ($1, $2, $3)
    RETURNING id
  `
  let bind = [req.ticketId, req.userId, req.type]

  return Model.query(sql, bind)
}

exports.details = async (req) => {
  let ticketId = req.body.ticketId
  let ticket = {}

  ticket.permits = TicketsExtModel.retrievePermits(ticketId)
  ticket.orders = TicketsExtModel.retrieveOrders(ticketId)
  ticket.details = TicketsExtModel.retrieveDetails(ticketId)
}

exports.listWorkers = async (req) => {
  let sql = `
    SELECT
      users.fname || ' ' || users.lname as name,
      user_id, type
    FROM ticket_workers
    JOIN users ON
      users.id = ticket_workers.user_id
    WHERE ticket_id = $1
  `
  let bind = [ req.id ]

  return Model.query(sql, bind)
}

/*
  _____  _    ____  _  ______
 |_   _|/ \  / ___|| |/ / ___|
   | | / _ \ \___ \| ' /\___ \
   | |/ ___ \ ___) | . \ ___) |
   |_/_/   \_\____/|_|\_\____/

*/

exports.createTask = async (req) => {
  let sql = `
    INSERT INTO ticket_tasks (ticket_id, task)
    VALUES ($1, $2)
    RETURNING id
  `
  let bind = [req.ticketId, req.task]

  return Model.query(sql, bind)
}

exports.deleteTask = async (req) => {
  let sql = `
    UPDATE ticket_tasks
    SET deleted = true
    WHERE id = $1
  `
  let bind = [req.id]

  return Model.query(sql, bind)
}

exports.retrieveTasks = async (req) => {
  let sql = `
    SELECT
      ticket_tasks.*
    FROM ticket_tasks
    WHERE ticket_id = $1
      AND NOT deleted
  `
  let bind = [ req.ticketId ]

  return Model.query(sql, bind)
}

exports.updateTask = async (id, fields) => {
  let update = Model.updateFields(fields)

  let sql = `
    UPDATE ticket_tasks SET ${update.set}
    WHERE id = $${update.count + 1}
  `
  update.bind.push(id)

  Model.run(sql, update.bind)
}

/*
  ____   _    ____ _____ ____
 |  _ \ / \  |  _ \_   _/ ___|
 | |_) / _ \ | |_) || | \___ \
 |  __/ ___ \|  _ < | |  ___) |
 |_| /_/   \_\_| \_\|_| |____/

*/

exports.createPart = async (req) => {
  let sql = `
    INSERT INTO ticket_parts (
      ticket_id, room_id, qty, payout, description
    ) VALUES ( $1, $2, $3, $4, $5 )
  `
  let bind = [
    req.ticketId, req.roomId, req.qty,
    req.payout, req.description
  ]

  return Model.query(sql, bind)
}

exports.retrieveParts = async (req) => {
  let sql = `
    SELECT
      ticket_parts.*,
      house_rooms.
    FROM ticket_parts
    WHERE ticket_id = $1
      AND NOT deleted
  `
  let bind = [ req.ticketId ]

  return Model.query(sql, bind)
}

exports.updatePart = async (id, fields) => {
  let update = Model.updateFields(fields)

  let sql = `
    UPDATE ticket_parts SET ${update.set}
    WHERE id = $${update.count + 1}
  `
  update.bind.push(id)

  Model.run(sql, update.bind)
}

/* PERMITS PERMITS PERMITS PERMITS */

exports.listPermits = async (req) => {
  let sql = `
    SELECT
      permits.name,
      to_char(permits.starts, 'MM/DD/YY') as starts,
      to_char(permits.ends, 'MM/DD/YY') as ends,
      inspectors.name as inspector
    FROM tickets
    JOIN permits
      ON permits.house_id = tickets.house_id
    WHERE tickets.id = $1
  `
  let bind = [ req.id ]

  return Model.query(sql, bind)
}

/* ORDERS ORDERS ORDERS ORDERS */

exports.listOrders = async (req) => {
  let sql = `
    SELECT
      orders.name,
      to_char(permits.ordered, 'MM/DD/YY') as ordered,
      suppliers.name as supplier
    FROM (
        SELECT ticket_id, order_id, count(*) as item_count
        FROM ticket_parts
        GROUP BY ticket_id, order_id
    ) total_parts
    LEFT JOIN (
        SELECT order_id, count(*) as received_count
        FROM ticket_parts
        WHERE received IS NOT NULL
        GROUP BY order_id
    ) received_parts
      ON received_parts.order_id = total_parts.order_id
    JOIN orders
      ON orders.id = total_parts.order_id
    JOIN suppliers
      ON suppliers.id = total_parts.supplier_id
    WHERE tickets.id = $1
  `
  let bind = [ req.id ]

  return Model.query(db, sql, id)
}

/*

  ____
 |  _ \ ___   ___  _ __ ___  ___
 | |_) / _ \ / _ \| '_ ` _ \/ __|
 |  _ < (_) | (_) | | | | | \__ \
 |_| \_\___/ \___/|_| |_| |_|___/

*/

exports.retrieveRooms = async(req) => {
  let sql = `
    SELECT
      house_rooms.name as room_name,
      house_rooms.id as room_id,
      house_rooms.name as room_name,
      house_rooms.tubside as room_tubside,
      house_rooms.color as room_color,
      ticket_parts.qty as part_qty,
      ticket_parts.payout as part_payout,
      ticket_parts.description as part_description,
      ticket_parts.order_id as part_order_id,
      ticket_parts.created as part_created,
      ticket_parts.updated as part_updated,
      ticket_parts.ordered as part_ordered,
      ticket_parts.received as part_received,
      ticket_parts.installed as part_installed,
      ticket_parts.destroyed as part_destroyed
    FROM ticket_parts
    LEFT JOIN house_rooms
      ON ticket_parts.room_id = house_rooms.id
    WHERE ticket_parts.ticket_id = $1
      AND NOT ticket_parts.deleted
      AND NOT house_rooms.deleted
  `
  let bind = [ req.id ]

  return Model.query(sql, bind)
}
