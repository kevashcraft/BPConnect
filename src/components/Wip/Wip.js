import TicketsModel from '../Tickets/TicketsModel'

exports.start = async (req, res) => {
  let ticketId = req.body.ticketId
  let fields = { started: 'NOW()' }
  await TicketsModel.update(ticketId, req.db)
}

exports.checkin = async (req, res) => {
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

exports.walk = async (req, res) => {
  let ticketId = req.body.ticketId
  let fields = { walked: 'NOW()'}
  await TicketsModel.update(ticketId, fields)
}

exports.list = async (req, res) => {
  let fields = {
    drstart: req.body.daterange[0],
    drend: req.body.daterange[1],
    ticketId: req.body.ticketId,
    houseId: req.body.houseId
  }
  let list = await WipModel.list(fields, req.db)
}

exports.search = async (req, res) => {
  let query = req.body.query

  let results = await WipModel.search(query, req.db)
}

