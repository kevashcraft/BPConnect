import * as Common from '../Common/Common'
import InspectionsModel from './InspectionsModel'
import moment from 'moment'

exports.list = async (req) => {
  return InspectionsModel.list(req)
}

exports.search = async (req) => {
  let categories = ['Tickets', 'Builders', 'Subdivisions', 'Lots', 'Orders']
  return Common.searchCategories(req, categories)
}

exports.searchInspectors = async (req) => {
  req.queryString = "'%" + req.query.replace(' ', "%', '%") + "%'"
  let results = await InspectionsModel.searchInspectors(req)

  return {
    success: true,
    results
  }
}

exports.updateFailed = async (req) => {
  let fields = { failed: { bind: moment(req.inspectionDateFailed) } }
  await InspectionsModel.update(req.inspectionId, fields)

  return true
}

exports.updatePassed = async (req) => {
  let fields = { passed: { bind: moment(req.inspectionDatePassed) } }
  await InspectionsModel.update(req.inspectionId, fields)

  return true
}

exports.updateScheduled = async (req) => {
  let fields = { scheduled: { bind: moment(req.inspectionDateScheduled) } }
  await InspectionsModel.update(req.inspectionId, fields)

  return true
}
