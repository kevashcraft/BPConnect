import XLSX from 'xlsx'
import moment from 'moment'

import TicketsModel from './TicketsModel'
import TicketsExtModel from './TicketsExtModel'
import TicketTypesModel from '../TicketTypes/TicketTypesModel'
import TicketWorkersModel from '../TicketWorkers/TicketWorkersModel'
import HousesExtModel from '../Houses/HousesExtModel'

/*

  ____                   _       _     _     _
 |  _ \ _   _ _ __   ___| |__   | |   (_)___| |_ ___
 | |_) | | | | '_ \ / __| '_ \  | |   | / __| __/ __|
 |  __/| |_| | | | | (__| | | | | |___| \__ \ |_\__ \
 |_|    \__,_|_| |_|\___|_| |_| |_____|_|___/\__|___/

*/

exports.createPunch = async (req) => {
  console.log('req', req)
  console.log('req.ticketTypeId', req.ticketTypeId)
  let ticketType = await TicketTypesModel.retrieve({ id: req.ticketTypeId })
  console.log('ticketType', ticketType)

  let ticket = {
    ticketTypeId: ticketType.punchId,
    houseId: req.houseId,
    ticketDate: moment(),
    supervisorId: req.bpSupervisorId,
    builderSupervisorId: req.builderSupervisorId,
    needspermit: false,
    needspo: false
  }

  let ticketId = await TicketsModel.create(ticket)

  TicketsModel.update(req.ticketId, { punch_id: ticketId })

  let workers = await TicketWorkersModel.retrieve({ticketId: req.ticketId})
  workers.forEach(async worker => {
    worker.ticketId = ticketId
    await TicketWorkersModel.create(worker)
  })

  return ticketId
}

/*

  _____  _    ____  _  ______
 |_   _|/ \  / ___|| |/ / ___|
   | | / _ \ \___ \| ' /\___ \
   | |/ ___ \ ___) | . \ ___) |
   |_/_/   \_\____/|_|\_\____/

*/

exports.createTask = async (req) => {
  await TicketsExtModel.createTask(req)
}

exports.deleteTask = async (req) => {
  await TicketsExtModel.deleteTask(req)
}

exports.retrieveTasks = async (req) => {
  return TicketsExtModel.retrieveTasks(req)
}

/*
  ____   _    ____ _____ ____
 |  _ \ / \  |  _ \_   _/ ___|
 | |_) / _ \ | |_) || | \___ \
 |  __/ ___ \|  _ < | |  ___) |
 |_| /_/   \_\_| \_\|_| |____/

*/

exports.retrieveParts = async (req) => {
  return TicketsExtModel.retrieveParts(req)
}

exports.dataImport = async (req) => {
  let workbook = XLSX.readFile(req.filepath) /* need filename */
  let sheetNames = workbook.SheetNames

  let csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetNames[0]], {FS: ':::::', RS: '|||||'})
  let rows = csv.split('|||||').map(row => row.split(':::::'))
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

    if (!row[0] || !row[0].length || row[0] === '0') {
      expectRoom = true
    }

    if (!row[3] || !row[3].length || row[3] === '0') {
      return
    }

    if (row[0] && row[0].length && row[0] !== '0' && !row[0].match(/left|right/i)) {
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

    let payout = parseFloat(row[2].replace(/[^0-9,.]/g, ''))
    if (!payout.length) {
      payout = 0
    }

    room.parts.push({
      qty: parseInt(row[1]),
      payout: payout,
      description: row[3]
    })
  })

  if (room) {
    rooms.push(room)
  }

  let ticketId = req.data.ticketId
  let ticket = await TicketsModel.retrieve({ id: ticketId })

  TicketsModel.update(ticketId, { imported: { safe: 'NOW()' } })

  rooms.forEach(async room => {
    room.houseId = ticket.houseId
    let roomId = await HousesExtModel.retrieveRoomIdByHNC(room)
    if (!roomId) {
      roomId = await HousesExtModel.createRoom(room)
    }

    room.parts.forEach(async part => {
      part.ticketId = ticket.ticketId
      part.roomId = roomId
      await TicketsExtModel.createPart(part)
    })
  })
}

exports.deleteWorkTask = async (req, res) => {
  let taskId = req.body.taskId
  await TicketsExtModel.deleteWorkTask(taskId)
}

exports.print = async (req, res) => {
  let ticketId = req.body.ticketId
  let ticket = TicketsModel.retrieve(ticketId)
  let ticketRooms = TicketsExtModel.retrieveRoomsAndsParts(ticketId)

  // make pdf
}

/* WORKERS WORKERS WORKERS WORKERS */

exports.listWorkers = async (req, res) => {
  let ticketId = req.body.ticketId
  return await TicketsExtModel.listWorkers(ticketId)
}

exports.updateWorkers = async (req, res) => {
  let workers = req.body.workers
  let ticketId = req.body.ticketId

  await TicketsExtModel.deleteWorkers(ticketId)

  workers.forEach(async worker => {
    worker.ticketId = ticketId
    await TicketsExtModel.createWorker(worker)
  })
}

/* TICKETS TICKETS TICKETS TICKETS */

exports.sendoutTicket = async (req, res) => {
  let ticketId = req.body.ticketId
  let fields = { sentout: 'NOW()' }
  await TicketsModel.update(ticketId, fields)
}
