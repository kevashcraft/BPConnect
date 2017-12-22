import * as OrdersModel from './OrdersModel'
import * as TicketsExtModel from '../Tickets/TicketsExtModel'

exports.create = async (req) => {
  let orderId = await OrdersModel.create(req)
  let fields = { order_id: orderId, ordered: { safe: 'NOW()' } }

  req.parts.forEach(async part => {
    await TicketsExtModel.updatePart(part.id, fields)
  })

  return orderId
}

exports.list = async (req) => {
  return OrdersModel.list(req)
}

exports.retrieve = async (req) => {
  let orderId = req.body.orderId
  return OrdersModel.retrieve(orderId, req.db)
}

exports.retrieveParts = async (req) => {
  return OrdersModel.retrieveParts(req)
}

exports.search = async (req) => {
  let query = req.body.query

  return OrdersModel.search(query, req.db)
}

exports.receiveParts = async (req) => {
  req.parts.forEach(async part => {
    let fields = { received: { safe: part.received ? 'current_timestamp' : 'NULL' } }
    await TicketsExtModel.updatePart(part.id, fields)
  })
}
