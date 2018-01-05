import * as Common from '../Common/Common'
import * as BuildersModel from '../Builders/BuildersModel'
import * as BuilderSupervisorsModel from '../BuilderSupervisors/BuilderSupervisorsModel'
import * as HousesModel from '../Houses/HousesModel'
import * as SubdivisionsModel from '../Subdivisions/SubdivisionsModel'
import * as TicketsModel from './TicketsModel'
import * as TicketTypesModel from '../TicketTypes/TicketTypesModel'
import * as PermitsModel from '../Permits/PermitsModel'

exports.hello = () => { return 'whoa!!' }

exports.create = async (req) => {
  let ticket = req.ticket

  if (ticket.builderId === -1) {
    let builder = {name: ticket.builderName, phone: ticket.builderPhone}
    ticket.builderId = await BuildersModel.create(builder)
  }

  if (ticket.builderSupervisorId === -1) {
    let builderSupervisor = {
      builderId: ticket.builderId,
      name: ticket.builderSupervisorName,
      phone: ticket.builderSupervisorPhone
    }
    ticket.builderSupervisorId = await BuilderSupervisorsModel.create(builderSupervisor)
  }

  if (ticket.subdivisionId === -1) {
    let subdivision = {
      builderId: ticket.builderId,
      zipcodeId: ticket.zipcodeId,
      name: ticket.subdivisionName
    }
    ticket.subdivisionId = await SubdivisionsModel.create(subdivision)
  }

  if (ticket.houseId === -1) {
    let house = {
      subdivisionId: ticket.subdivisionId,
      lot: ticket.houseLot,
      address: ticket.houseAddress
    }
    ticket.houseId = await HousesModel.create(house)
  }

  let ticketType = await TicketTypesModel.retrieve({ id: ticket.ticketTypeId })

  ticket.needspermit = ticketType.needspermit
  ticket.needspo = ticketType.needspo

  let ticketId = await TicketsModel.create(ticket)

  console.log('ticketType.needspermit', ticketType.needspermit)
  if (ticketType.needspermit) {
    let permit = { houseId: ticket.houseId }
    let permitCountForHouse = await PermitsModel.countForHouseId({id: ticket.houseId})
    console.log('permitCountForHouse', permitCountForHouse)
    if (permitCountForHouse === 0) {
      let permitId = await PermitsModel.create(permit)
      console.log('permitId', permitId)
    }
  }

  return ticketId
}

exports.search = async (req) => {
  let categories = ['Tickets', 'Builders', 'Subdivisions', 'Lots', 'Orders']
  return Common.searchCategories(req, categories)
}

exports.list = async (req) => {
  return TicketsModel.list(req)
}

exports.retrieve = async (req) => {
  return TicketsModel.retrieve({id: req.id})
}

exports.retrieveParts = async (req) => {
  return TicketsModel.retrieveParts(req)
}
