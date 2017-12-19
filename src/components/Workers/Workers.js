import * as Workers from './WorkersModel'

exports.list = async (req) => {
  return await Workers.list()
}
