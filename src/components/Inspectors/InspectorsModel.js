import Model from '../Model'

exports.create = async (req) => {
  let sql = `
    INSERT INTO inspectors (name, address, email, phone, fax, url, zipcode_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
  `
  let bind = [req.name, req.address, req.email, req.phone, req.fax, req.url, req.zipcodeId]

  return Model.query(sql, bind, true, true)
}

exports.list = async (req) => {
  let sql = `
    SELECT
      inspectors.id,
      inspectors.id as inspector_id,
      inspectors.created,
      inspectors.name,
      inspectors.address,
      inspectors.email,
      inspectors.phone,
      inspectors.fax,
      inspectors.url,
      inspectors.deleted,
      inspectors.zipcode_id,
      locations.citystate
    FROM inspectors
    LEFT JOIN locations ON locations.zipcode_id = inspectors.zipcode_id
    WHERE inspectors.deleted = $1
  `
  let bind = [req.deleted]

  return Model.query(sql, bind)
}

exports.search = async (req) => {
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
    UPDATE inspectors SET ${update.set}
    WHERE id = $${update.count + 1}
  `
  update.bind.push(id)

  Model.run(sql, update.bind)
}
