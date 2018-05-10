import * as Model from '../Model'

exports.list = async (req) => {
  let sql = `
    SELECT
      users.*,
      users.first_name || ' ' || users.last_name as name,
      workers.type
    FROM workers
    JOIN users ON users.id = workers.user_id
    ORDER BY
      users.first_name,
      users.last_name
  `
  let bind = []

  return Model.query(sql, bind)
}

exports.search = async (req) => {
  let sql = `
    SELECT
      users.id,
      initcap(workers.type::text) as category,
      workers.type,
      users.first_name || ' ' || users.last_name as title
    FROM users
    JOIN workers ON workers.user_id = users.id
    WHERE users.first_name || ' ' || users.last_name ilike ANY(ARRAY[${req.queryString}])
    ORDER BY similarity(users.first_name || ' ' || users.last_name, $1) DESC
    LIMIT 5
  `
  let bind = [ req.query ]

  return Model.query(sql, bind)
}

exports.update = async (req) => {
  let sql = `
    UPDATE tickets SET
      scheduled = $1,
      bumped = bumped + 1
    WHERE id = $2
  `
  let bind = [req.scheduled, req.ticketId]

  return Model.query(sql, bind)
}
