import * as Builders from './BuildersModel'

exports.list = async (req) => {
  return Builders.list()
}

exports.retrieve = async (req) => {
  return TicketsModel.retrieve(req)
}

exports.search = async (req) => {
  req.queryString = "'%" + req.query.replace(' ', "%', '%") + "%'"
  let results = await Builders.search(req)

  return {
    success: true,
    results
  }
}
