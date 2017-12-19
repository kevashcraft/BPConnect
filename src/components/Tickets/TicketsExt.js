import XLSX from 'xlsx'

import TicketsModel     from './TicketsModel'
import TicketsExtModel  from './TicketsExtModel'
import TicketTypesModel from '../TicketTypes/TicketTypesModel'


exports.punchCreate = async (req, res) => {
  let ticketId = req.body.ticketId
  let ticket = await TicketsModel.retrieve(ticketId, req.db)
  let ticketType = await TicketTypesModel.retrieve(ticket.ticketTypeId, req.db)

  ticket.ticketTypeId = ticketType.punchTypeId

  let punchId = await TicketsModel.create(ticket, req.db)

  TicketsModel.update(ticket.id, { punch_id: punchId }, req.db)

  let workers = await TicketsExtModel.retrieveWorkers(ticket.id, req.db)
  workers.forEach((e, i, a) => {
    workers[i].ticketId = punchId
  })
  TicketsExtModel.createWorkers(workers, req.db)
}

exports.taskCreate = async (req, res) => {
  await TicketsExtModel.taskCreate(req.body.ticketTask, req.db)
}

exports.tasksRetrieve = async (req, res) => {
  await TicketsExtModel.tasksRetrieve(req.body.ticketId, req.db)
}

exports.dataImport = async (req) => {
  let workbook = XLSX.readFile(req.filepath) /* need filename */
  let sheetNames = workbook.SheetNames

  let csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetNames[0]], {FS:':::::', RS:'|||||'})
  let rows = csv.split("|||||").map(row => row.split(':::::'))
  // rows.map
  // console.log("workbook.Sheets[sheetNames[0]]",workbook.Sheets[sheetNames[0]]);

  let rooms = []
  let start = false
  let expectRoom = false
  let hand = null
  let room = false
  rows.forEach((row) => {
    if (!start) {
      if (row[0].match(/garage hand/i)) {
        hand = row[3]
      } else if (row[0].match(/model/i)) {
        let model = row[3]
        start = true
        expectRoom = true
      }
      return
    }

    if (!row[0] || !row[0].length || row[0] === "0") {
      expectRoom = true
    }

    if (!row[3] || !row[3].length || row[3] === "0") {
      return
    }

    if (row[0] && row[0].length && row[0] !== "0" && !row[0].match(/left|right/i)) {
      if (expectRoom) {
        expectRoom = false
        if (room) {
          rooms.push(room)
        }

        room = {
          name: row[0],
          color: null,
          parts: []
        }
      }

      if (room.parts.length) {
        if (room.color === null) {
          room.color = row[0]
        }
      }
    }

    let payout = row[2].replace(/[^0-9,.]/, '')
    if (!payout.length) {
      payout = 0
    }

    room.parts.push({
      qty: row[1],
      payout: payout,
      description: row[3]
    })
  })

  if (room) {
    rooms.push(room)
  }

  console.log("rooms",rooms);
  let ticket = await TicketsModel.retrieve(ticketId, req.db)
  TicketsModel.update(ticketId, { imported: 'NOW()'})

  rooms.forEach(async room => {
    room.houseId = ticket.houseId
    let roomId = HousesExtModel.retrieveRoomIdByHNC(room, req.db)
    if (!roomId) {
      roomId = await HousesExtModel.createRoom(room, req.db)
    }

    room.parts.forEach(async part => {
      part.ticketId = ticket.id
      part.roomId = roomId
      await TicketsExtModel.createPart(part, req.db)
    })
  })

  TicketsExtModel.updatePayout(ticket.id, req.db)
}

exports.deleteWorkTask = async (req, res) => {
  let taskId = req.body.taskId
  await TicketsExtModel.deleteWorkTask(taskId, req.db)
}

exports.print = async (req, res) => {
  let ticketId = req.body.ticketId
  let ticket = TicketsModel.retrieve(ticketId, req.db)
  let ticketRooms = TicketsExtModel.retrieveRoomsAndsParts(ticketId, req.db)

  // make pdf
}

/* WORKERS WORKERS WORKERS WORKERS */

exports.listWorkers = async (req, res) => {
  let ticketId = req.body.ticketId
  return await TicketsExtModel.listWorkers(ticketId, req.db)
}

exports.updateWorkers = async (req, res) => {
  let workers = req.body.workers
  let ticketId = req.body.ticketId

  await TicketsExtModel.deleteWorkers(ticketId, req.db)

  workers.forEach(async worker => {
    worker.ticketId = ticketId
    await TicketsExtModel.createWorker(worker, req.db)
  })
}

/* TICKETS TICKETS TICKETS TICKETS */

exports.sendoutTicket = async (req, res) => {
  let ticketId = req.body.ticketId
  let fields = { sentout: 'NOW()' }
  await TicketsModel.update(ticketId, fields, req.db)
}

