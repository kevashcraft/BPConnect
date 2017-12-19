import * as OrdersModel from './OrdersModel'
import * as TicketsExtModel from '../Tickets/TicketsExtModel'

exports.create = async (req, res) => {
  let order = req.body.order
  let parts = req.body.parts

  let orderId = await OrdersModel.create(order, req.db)
  let fields = { order_id: orderId, ordered: order.ordered }
  parts.forEach(async part => {
    await TicketsExtModel.updatePart(part.id, fields, req.db)
  })
}

exports.list = async (req, res) => {
  let fields = {
    drstart: req.body.daterange[0],
    drend: req.body.daterange[1],
    orderId: req.body.orderId,
    ticketId: req.body.ticketId,
    supplierId: req.body.supplierId,
  }

  return await OrdersModel.search(fields, req.db)
}

exports.retrieve = async (req, res) => {
  let orderId = req.body.orderId
  return await OrdersModel.retrieve(orderId, req.db)
}

exports.search = async (req, res) => {
  let query = req.body.query

  return await OrdersModel.search(query, req.db)
}

exports.receiveParts = async (req, res) => {
  let parts = req.body.parts

  parts.forEach(async part => {
    let fields = { received: part.received }
    await TicketsExtModel.updatePart(part.id, fields, req.db)
  })
}