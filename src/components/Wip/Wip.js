import WipModel from '../Wip/WipModel'

exports.start = async (req) => {
  let ticketId = req.body.ticketId
  let fields = { started: 'NOW()' }
  await TicketsModel.update(ticketId, req.db)
}

exports.checkin = async (req) => {
  let ticketId = req.body.ticketId
  let fields = { completed: 'NOW()' }
  await TicketsModel.update(ticketId, req.db)

  let ticket = TicketsModel.retreive(ticketId)

  if (ticket.needsPermit) {
    let permitId = await HousesExtModel.retrievePermits(ticket.houseId, req.db)
    let inspectionId = await Inspections.create(inspection, req.db)

    let inspection = { permitId, inspectionId }
    await InspectionsModel.create(inspection, req.db)
  }
}

exports.walk = async (req) => {
  let ticketId = req.body.ticketId
  let fields = { walked: 'NOW()'}
  await TicketsModel.update(ticketId, fields)
}

exports.list = async (req) => {

  return await WipModel.list(req)
}

exports.search = async (req) => {
  let query = req.body.query

  let results = await WipModel.search(query, req.db)
}

