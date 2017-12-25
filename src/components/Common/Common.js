import CommonModel from '../Common/CommonModel'

exports.searchCategories = async (req, categories) => {
  req.categories = "'" + categories.join("','") + "'"
  req.queryArray = "'%" + req.query.replace(' ', "%', '%").toLowerCase() + "%'"
  let results = await CommonModel.searchCategories(req)

  if (results.length && results[0].category) {
    let categories = [...new Set(results.map(result => result.category))]
    let newResults = {}

    categories.forEach(category => {
      newResults[category] = {
        name: category,
        results: results.filter(result => result.category === category)
      }
    })
    results = newResults
  }

  return {
    success: true,
    results
  }
}
