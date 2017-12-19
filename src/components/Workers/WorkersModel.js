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

  return await Model.query(sql, bind)
}

exports.search = async (req) => {
  let sql = `
    SELECT * FROM (
      SELECT
        'Plumbers' as category,
        similarity(users.fname || ' ' || users.lname, :query) as ord1,
        0 as ord2,
        users.id,
        'plumber' as type,
        users.fname || ' ' || users.lname as title
      FROM workers
      JOIN users
        ON users.id = workers.user_id
      WHERE workers.type = 'plumber'
        AND (
          users.fname ILIKE ANY $query
          OR users.lname ILIKE ANY $query
        )
      UNION
      SELECT
        'Helpers' as category,
        similarity(users.fname || ' ' || users.lname, :query) as ord1,
        1 as ord2,
        users.id,
        'helper' as type,
        users.fname || ' ' || users.lname as title
      FROM workers
      JOIN users
        ON users.id = workers.user_id
      WHERE (workers.type = 'plumber'
        OR workers.type = 'helper')
        AND (
          users.fname ILIKE ANY $query
          OR users.lname ILIKE ANY $query
        )
    ) search
    ORDER BY ord1 DESC, ord2 ASC
    LIMIT 10
  `
  let bind = [ req.query ]

  return await Model.query(sql, bind)
}

exports.update = async (req) => {
  let sql = `
    UPDATE tickets SET
      scheduled = $1,
      bumped = bumped + 1
    WHERE id = $2
  `
  let bind = [req.scheduled, req.ticketId]

  return await Model.query(sql, bind)
}

