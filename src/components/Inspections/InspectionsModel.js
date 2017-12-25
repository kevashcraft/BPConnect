import Model from '../Model'

exports.create = async (rea, db) => {
  let sql = `
    INSERT INTO inspections (ticket_id, permit_id)
    VALUES ($1, $2)
    RETURNING id
  `
  let bind = [rea.ticketId, rea.permitId]

  return Model.query(sql, bind)
}

exports.list = async (req, db) => {
  let sql = `
    SELECT * FROM inspections_view
    WHERE
      ((permit_date_starts >= $1
          AND permit_date_starts <= $2)
        OR (permit_date_ends >= $1
          AND permit_date_ends <= $2)
        OR (inspection_date_scheduled >= $1
          AND inspection_date_scheduled <= $2)
        OR (ticket_date_created >= $1
          AND ticket_date_created <= $2)
        OR (ticket_date_scheduled >= $1
          AND ticket_date_scheduled <= $2))
      AND ($3 = 0
        OR inspections_view.ticket_id = $3)
      AND ($4 = 0
        OR inspections_view.permit_id = $4)
      AND ($5 = 0
        OR inspections_view.inspection_id = $5)
      AND ($6 = 0
        OR inspections_view.inspector_id = $6)
      AND ($7 = 0
        OR inspections_view.house_id = $7)
      LIMIT 1000
  `
  let bind = [
    req.daterange[0], req.daterange[1],
    req.ticketId.value, req.permitId.value,
    req.inspectionId.value, req.inspectorId.value,
    req.houseId.value
  ]

  return Model.query(sql, bind)
}

exports.retrieve = async (req) => {
  let sql = `
    SELECT * FROM inspections_view
    WHERE inspection_id = $1
  `
  let bind = [req.id]

  return Model.query(sql, bind)
}

exports.searchInspectors = async (req) => {
  let sql = `
    SELECT
      inspectors.id,
      inspectors.name as title
    FROM inspectors
    WHERE inspectors.name ilike ANY(ARRAY[${req.queryString}])
    ORDER BY similarity(inspectors.name, $1) DESC
    LIMIT 10
  `
  let bind = [req.query]

  return Model.query(sql, bind)
}

exports.update = async (id, fields) => {
  let update = Model.updateFields(fields)

  let sql = `
    UPDATE inspections SET ${update.set}
    WHERE id = $${update.count + 1}
  `
  update.bind.push(id)

  Model.run(sql, update.bind)
}
