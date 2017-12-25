import * as Common from '../Common/Common'
import WipModel from './WipModel'
import HousesModel from '../Houses/HousesModel'
import InspectionsModel from '../Inspections/InspectionsModel'
import TicketsModel from '../Tickets/TicketsModel'

exports.list = async (req) => {
  let ret = await WipModel.list(req)
  console.log('ret', ret)
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

  console.log('req', req)
  console.log('req.ticketNeedspermit', req.ticketNeedspermit)
  if (req.ticketNeedspermit) {
    let permits = await HousesModel.retrievePermits({houseId: req.houseId})
    console.log('permit', permits)
    let inspection = { ticketId, permitId: permits[0].id }
    let inspectionId = await InspectionsModel.create(inspection)
    console.log('inspectionId', inspectionId)

    return inspectionId
  }

  return true
}

exports.updateWalked = async (req) => {
  let ticketId = req.ticketId
  let fields = { walked: { safe: 'current_timestamp' } }
  await TicketsModel.update(ticketId, fields)
  return true
}
