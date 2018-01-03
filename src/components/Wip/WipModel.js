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
      AND ($3 = 0
        OR wip_view.ticket_id = $3)
      AND ($4 = 0
        OR wip_view.house_id = $4)
    LIMIT 5000
  `
  let bind = [
    req.daterange[0], req.daterange[1],
    req.ticketId.value, req.houseId.value
  ]

  return Model.query(sql, bind)
}
