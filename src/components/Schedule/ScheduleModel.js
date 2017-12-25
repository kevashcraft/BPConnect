import * as Model from '../Model'

exports.list = async (req) => {
  let sql = `
    SELECT * FROM schedule_view
    WHERE ticket_date_scheduled >= $1
        AND ticket_date_scheduled <= $2
      AND ($3 = 0
        OR schedule_view.ticket_id = $3)
      AND ($4 = 0
        OR schedule_view.builder_id = $4)
      AND ($5 = 0
        OR schedule_view.subdivision_id = $5)
      AND ($6 = 0
        OR schedule_view.house_id = $6)
      AND ($7 = 0
        OR schedule_view.plumber_id = $7)
      AND ($8 = 0
        OR schedule_view.helper_id = $8)
    LIMIT 1000
  `
  let bind = [
    req.daterange[0], req.daterange[1],
    req.ticketId.value, req.builderId.value,
    req.subdivisionId.value, req.houseId.value,
    req.plumberId.value, req.helperId.value
  ]

  return Model.query(sql, bind)
}

exports.retrieve = async (req) => {
  let sql = `
    SELECT * FROM schedule_view
    WHERE ticket_id = $1
  `
  let bind = [req.id]

  return Model.query(sql, bind)
}
