import * as Model from '../Model'

exports.list = async (req) => {
  let sql = `
    SELECT
      users.*,
      users.fname || ' ' || users.lname as name,
      workers.type
    FROM workers
    JOIN users ON users.id = workers.user_id
    ORDER BY
      users.fname,
      users.lname
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
      users.fname || ' ' || users.lname as title
    FROM users
    JOIN workers ON workers.user_id = users.id
    WHERE users.fname || ' ' || users.lname ilike ANY(ARRAY[${req.queryString}])
    ORDER BY similarity(users.fname || ' ' || users.lname, $1) DESC
    LIMIT 10
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
