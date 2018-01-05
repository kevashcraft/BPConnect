import * as Common from '../Common/Common'
import WipModel from './WipModel'
import HousesModel from '../Houses/HousesModel'
import InspectionsModel from '../Inspections/InspectionsModel'
import TicketsModel from '../Tickets/TicketsModel'
import TicketsExtModel from '../Tickets/TicketsExtModel'

exports.list = async (req) => {
  let ret = await WipModel.list(req)
  return ret
}

exports.search = async (req) => {
  let categories = ['Tickets', 'Builders', 'Subdivisions', 'Lots', 'Orders']
  return Common.searchCategories(req, categories)
}

exports.updateStarted = async (req) => {
  let ticketId = req.ticketId
  let fields = { started: { safe: 'current_timestamp' } }
  await TicketsModel.update(ticketId, fields)

  return true
}

exports.updateCompleted = async (req) => {
  let ticketId = req.ticketId
  let fields = { completed: { safe: 'current_timestamp' } }
  await TicketsModel.update(ticketId, fields)

  req.parts.forEach(async part => {
    let fields = { installed: { safe: 'current_timestamp' } }
    await TicketsExtModel.updatePart(part.id, fields)
  })

  req.tasks.forEach(async task => {
    let fields = { completed: { safe: 'current_timestamp' } }
    await TicketsExtModel.updateTask(task.id, fields)
  })

  return true
}

exports.updateWalked = async (req) => {
  let ticketId = req.ticketId
  let fields = { walked: { safe: 'current_timestamp' } }
  await TicketsModel.update(ticketId, fields)

  req.parts.forEach(async part => {
    let fields = { walked: { safe: 'current_timestamp' } }
    await TicketsExtModel.updatePart(part.id, fields)
  })

  req.tasks.forEach(async task => {
    let fields = { walked: { safe: 'current_timestamp' } }
    await TicketsExtModel.updateTask(task.id, fields)
  })

  // create inspection placeholder
  let ticket = await TicketsModel.retrieve({id: ticketId})
  if (ticket.ticketNeedspermit) {
    let permits = await HousesModel.retrievePermits(ticket)
    let inspection = {
      ticketId: ticket.ticketId,
      permitId: permits[0].id
    }
    await InspectionsModel.create(inspection)
  }

  return true
}
