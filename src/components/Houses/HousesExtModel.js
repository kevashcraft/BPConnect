import Model from '../Model'

exports.createRoom = async (req) => {
  let sql = `
    INSERT INTO house_rooms (house_id, name, color)
    VALUES ($1, $2, $3)
    RETURNING id
  `
  let bind = [req.houseId, req.name, req.color]

  return await Model.query(sql, bind, true, true)
}

exports.retrieveRoomIdByHNC = async (req) => {
  let sql = `
    SELECT id
    FROM house_rooms
    WHERE house_rooms.house_id = $1
      AND house_rooms.name = $2
      AND house_rooms.color = $3
  `
  let bind = [req.houseId, req.name, req.color || '']

  return await Model.query(sql, bind, true, true)
}

exports.countRooms = async (req) => {
  let sql = `
    SELECT count(*) FROM house_rooms WHERE house_id = $1
  `
  let bind = [id]

  return await Model.query(sql, bind)
}
