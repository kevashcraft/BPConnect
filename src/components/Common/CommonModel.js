import Model from '../Model'

exports.searchCategories = async (req) => {
  let sql = `
    SELECT * FROM (
      SELECT * FROM (
        SELECT * FROM (
          SELECT
            'Tickets' as category,
            similarity(tickets_matv.id::text, lower($1)) as ord1,
            0 as ord2,
            'ticketId' as filter,
            tickets_matv.id,
            tickets_matv.id::text as title,
            tickets_matv.subdivision_name
              || ' lot ' || tickets_matv.house_lot
              || ' by ' || tickets_matv.builder_name
              as description
          FROM tickets_matv
          WHERE tickets_matv.ticket_id_text LIKE ANY (ARRAY[${req.queryArray}])
            OR tickets_matv.subdivision_name_lower LIKE ANY (ARRAY[${req.queryArray}])
            OR tickets_matv.builder_name_lower LIKE ANY (ARRAY[${req.queryArray}])
            OR tickets_matv.house_lot_lower LIKE ANY (ARRAY[${req.queryArray}])
        ) tickets_search
        ORDER BY ord1 DESC
        LIMIT 3
      ) tickets_search_ordered
      UNION ALL
      SELECT * FROM (
        SELECT * FROM (
          SELECT
            'Builders' as category,
            similarity(btrim(lower(builders.name)), lower($1)) as ord1,
            1 as ord2,
            'builderId' as filter,
            builders.id,
            builders.name as title,
            ''::text as description
          FROM builders
          WHERE btrim(lower(builders.name)) LIKE ANY (ARRAY[${req.queryArray}])
        ) builders_search
        ORDER BY ord1 DESC
        LIMIT 3
      ) builders_search_ordered
      UNION ALL
      SELECT * FROM (
        SELECT * FROM (
          SELECT
            'Subdivisions' as category,
            ((similarity(btrim(lower(builders.name)), lower($1)) * 4) + similarity(btrim(lower(subdivisions.name)), lower($1)))/5 as ord1,
            2 as ord2,
            'subdivisionId' as filter,
            subdivisions.id,
            subdivisions.name as title,
            'By ' || builders.name as description
          FROM subdivisions
          JOIN builders ON builders.id = subdivisions.builder_id
          WHERE btrim(lower(subdivisions.name)) LIKE ANY (ARRAY[${req.queryArray}])
            OR btrim(lower(builders.name)) LIKE ANY (ARRAY[${req.queryArray}])
        ) subdivisions_search
        ORDER BY ord1 DESC
        LIMIT 3
      ) subdivisions_search_ordered
      UNION ALL
      SELECT * FROM (
        SELECT * FROM (
          SELECT
            'Lots' as category,
            (similarity(btrim(lower(builders.name)), lower($1)) + (4 * similarity(btrim(lower(subdivisions.name)), lower($1))) + (5 * similarity(btrim(lower(houses.lot)), lower($1))))/10 as ord1,
            3 as ord2,
            'houseId' as filter,
            houses.id,
            subdivisions.name || ' lot ' || houses.lot as title,
            'By ' || builders.name as description
          FROM houses
          JOIN subdivisions ON subdivisions.id = houses.subdivision_id
          JOIN builders ON builders.id = subdivisions.builder_id
          WHERE btrim(lower(builders.name)) LIKE ANY (ARRAY[${req.queryArray}])
            OR btrim(lower(subdivisions.name)) LIKE ANY (ARRAY[${req.queryArray}])
            OR btrim(lower(houses.lot)) LIKE ANY (ARRAY[${req.queryArray}])
            OR btrim(lower(houses.address)) LIKE ANY (ARRAY[${req.queryArray}])
        ) lots_search
        ORDER BY ord1 DESC
        LIMIT 3
      ) lots_search_ordered
      UNION ALL
      SELECT * FROM (
        SELECT * FROM (
          SELECT
            'Orders' as category,
            (similarity(btrim(lower(orders.name)), lower($1)) + similarity(btrim(lower(suppliers.name)), lower($1))) as ord1,
            0 as ord2,
            'orderId' as filter,
            orders.id,
            orders.name as title,
            'Purchased ' || to_char(orders.created, 'MM/DD/YY') || ' from ' || suppliers.name as description
          FROM orders
          JOIN suppliers
            ON suppliers.id = orders.supplier_id
          WHERE btrim(lower(orders.name)) LIKE ANY (ARRAY[${req.queryArray}])
        ) orders_search
        ORDER BY ord1 DESC
        LIMIT 3
      ) orders_search_ordered
    ) search
    WHERE category IN (${req.categories})
    ORDER BY ord1 DESC
  `
  let bind = [ req.query ]

  return Model.query(sql, bind)
}
