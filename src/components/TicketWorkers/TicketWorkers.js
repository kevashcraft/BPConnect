import * as TicketWorkersModel from './TicketWorkersModel'

exports.retrieve = async (req) => {
  console.log('here!')
  return TicketWorkersModel.retrieve(req)
}

exports.update = async (req) => {
  await TicketWorkersModel.delete(req)
  req.workers.forEach(async worker => {
    worker.ticketId = req.ticketId
    await TicketWorkersModel.create(worker)
  })

  return true
}
