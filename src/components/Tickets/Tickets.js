import * as BuildersModel from '../Builders/BuildersModel'
import * as BuilderSupervisorsModel from '../BuilderSupervisors/BuilderSupervisorsModel'
import * as SubdivisionsModel from '../Subdivisions/SubdivisionsModel'
import * as TicketsModel from './TicketsModel'
import * as TicketTypesModel from '../TicketTypes/TicketTypesModel'

exports.hello = () => { return 'whoa!!' }

exports.create = async (req) => {
  let ticket = req.ticket

  if (ticket.builderId === -1) {
    ticket.builderId = await BuildersModel.create(ticket.builder)
  }

  if (ticket.builderSupervisorId === -1) {
    ticket.builderSupervisor.builderId = ticket.builderId
    ticket.builderSupervisorsId = await BuildersSupervisorsModel.create(ticket.builderSupervisor)
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

  if (ticketType.needsPermit) {
    let permit = { houseId: ticket.houseId }
    let permitCountForHouse = await PermitsModel.countForHouseId(ticket.houseId)
    if (!permitCountForHouse) {
      PermitsModel.create(permit)
    }
  }
}

exports.search = async (req) => {
  let query = req.body.query
  let results = TicketsModel.search(query)
  // need to sort
  // array[catefory] = { name, results}

}

exports.list = async (req) => {

  return await TicketsModel.list(req)
}

exports.retrieve = async (req) => {
  let ticketId = req.body.ticketId
  let ticket = TicketsModel.retrieve(ticketId)
}

exports.details = async (req) => {
  let ticketId = req.body.ticketId
  let ticket = {}

  ticket.permits = TicketsExtModel.retrievePermits(ticketId)
  ticket.orders = TicketsExtModel.retrieveOrders(ticketId)
  ticket.details = TicketsExtModel.retrieveDetails(ticketId)
}
