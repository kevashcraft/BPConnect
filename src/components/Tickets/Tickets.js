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
    ticket.builderId = await BuildersModel.create(ticket.builder)
  }

  if (ticket.builderSupervisorId === -1) {
    ticket.builderSupervisor.builderId = ticket.builderId
    ticket.builderSupervisorsId = await BuilderSupervisorsModel.create(ticket.builderSupervisor)
  }

  if (ticket.subdivisionId === -1) {
    ticket.subdivision.builderId = ticket.builderId
    ticket.subdivisionsId = await SubdivisionsModel.create(ticket.subdivision)
  }

  if (ticket.houseId === -1) {
    ticket.house.subdivisionId = ticket.subdivisionId
    ticket.housesId = await HousesModel.create(ticket.house)
  }

  let ticketType = await TicketTypesModel.retrieve({ id: ticket.ticketTypeId })

  ticket.needspermit = ticketType.needspermit
  ticket.needspo = ticketType.needspo

  let ticketId = await TicketsModel.create(ticket)

  if (ticketType.needspermit) {
    // let permit = { houseId: ticket.houseId }
    // let permitCountForHouse = await PermitsModel.countForHouseId(ticket.houseId)
    // console.log('permitCountForHouse', permitCountForHouse)
    // if (permitCountForHouse == 0) {
    //   // let permitId = await PermitsModel.create(permit)
    // }
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
