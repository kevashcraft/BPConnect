import db from '../api/postgres'

let camelCase = (str) => {
  return str.replace(/_([a-z])/g, (g) => {
    return g[1].toUpperCase()
  })
}

let convertRows = (rows) => {
  rows.forEach((row, i, rows) => {
    Object.keys(row).forEach(key => {
      let cCKey = camelCase(key)

      if (cCKey !== key) {
        rows[i][cCKey] = row[key]
        delete rows[i][key]
      }
    })
  })

  return rows
}

exports.query = async (sql, bind, astr = false, asv = false) => {
  try {
    let results = await db.query(sql, bind)

    let ret = convertRows(results.rows)

    if (astr || asv) {
      ret = ret[0]
    }

    if (asv) {
      if (typeof ret === 'object') {
        let key = Object.keys(ret)
        ret = ret[key]
      }
    }

    return ret
  } catch (e) {
    console.log('Could not run query', sql, bind, e)
    return false
  }
}

exports.run = async (sql, bind) => {
  try {
    db.query(sql, bind)
  } catch (e) {
    console.log('Could not run query', sql, bind, e)
  }
}

exports.updateFields = (fields) => {
  let count = 0
  let bind = []
  let set = Object
    .keys(fields)
    .map((field, index) => {
      if (typeof fields[field] === 'object') {
        return field + ' = ' + fields[field].safe
      } else {
        count++
        bind.push(fields[field])
        return field + ' = $' + (index + 1)
      }
    })
    .join(',')

  return {
    count,
    bind,
    set
  }
}

exports.cc = (str) => {
  let cc = myString.replace(/_([a-z])/g, (g) => { return g[1].toUpperCase() })
}
