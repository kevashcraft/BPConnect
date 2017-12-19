import * as TicketTypes from './TicketTypesModel'

exports.list = async (req) => {
  return TicketTypes.list()
}

exports.retrieve = async (req) => {
  return TicketsModel.retrieve(req)
}
