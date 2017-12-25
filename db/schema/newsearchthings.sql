DROP MATERIALIZED VIEW IF EXISTS tickets_matv;
CREATE MATERIALIZED VIEW tickets_matv AS
  SELECT tickets.*
    , tickets.id as ticket_id
    , tickets.id::text as ticket_id_text
    , subdivisions.name as subdivision_name
    , btrim(lower(subdivisions.name)) as subdivision_name_lower
    , houses.lot as house_lot
    , btrim(lower(houses.lot)) as house_lot_lower
    , builders.name as builder_name
    , btrim(lower(builders.name)) as builder_name_lower
  FROM tickets
  JOIN houses ON houses.id = tickets.house_id
  JOIN subdivisions ON subdivisions.id = houses.subdivision_id
  JOIN builders ON builders.id = subdivisions.builder_id
;
DROP INDEX IF EXISTS tickets_matv_ticket_id;
CREATE INDEX tickets_matv_ticket_id ON tickets_matv (ticket_id_text);
DROP INDEX IF EXISTS tickets_matv_subdivision_name;
CREATE INDEX tickets_matv_subdivision_name ON tickets_matv (subdivision_name_lower);
DROP INDEX IF EXISTS tickets_matv_builder_name;
CREATE INDEX tickets_matv_builder_name ON tickets_matv (builder_name_lower);
DROP INDEX IF EXISTS tickets_matv_house_lot;
CREATE INDEX tickets_matv_house_lot ON tickets_matv (house_lot_lower);

EXPLAIN ANALYZE
SELECT
  'Tickets' as category,
  similarity(tickets_matv.id::text, 'te') as ord1,
  0 as ord2,
  'ticket_id' as filter,
  tickets_matv.id,
  tickets_matv.id::text as title,
  tickets_matv.subdivision_name
    || ' lot ' || tickets_matv.house_lot
    || ' by ' || tickets_matv.builder_name
    as description
FROM tickets_matv
WHERE tickets_matv.ticket_id_text like '%te%'
  OR tickets_matv.subdivision_name_lower like '%te%'
  OR tickets_matv.builder_name_lower like '%te%'
  OR tickets_matv.house_lot_lower like '%te%'
UNION ALL
SELECT
  'Builders' as category,
  similarity(builders.name, 'te') as ord1,
  1 as ord2,
  'builder_id' as filter,
  builders.id,
  builders.name as title,
  ''::text as description
FROM builders
WHERE builders.name ILIKE '%te%'
UNION ALL
SELECT
  'Subdivisions' as category,
  ((similarity(builders.name, 'te') * 4) + similarity(subdivisions.name, 'te'))/5 as ord1,
  2 as ord2,
  'subdivision_id' as filter,
  subdivisions.id,
  subdivisions.name as title,
  'By ' || builders.name as description
FROM subdivisions
JOIN builders ON builders.id = subdivisions.builder_id
WHERE subdivisions.name ILIKE '%te%'
  OR builders.name ILIKE '%te%'
UNION ALL
SELECT
  'Lots' as category,
  (similarity(builders.name, 'te') + similarity(subdivisions.name, 'te') + similarity(houses.lot, 'te'))/3 as ord1,
  3 as ord2,
  'house_id' as filter,
  houses.id,
  subdivisions.name || ' lot ' || houses.lot as title,
  'By ' || builders.name as description
FROM houses
JOIN subdivisions ON subdivisions.id = houses.subdivision_id
JOIN builders ON builders.id = subdivisions.builder_id
WHERE builders.name ILIKE '%te%'
  OR subdivisions.name ILIKE '%te%'
  OR houses.lot ILIKE '%te%'
  OR houses.address ILIKE '%te%'
UNION ALL
SELECT
  'Orders' as category,
  (similarity(orders.name, 'te') + similarity(suppliers.name, 'te')) as ord1,
  0 as ord2,
  'order_id' as filter,
  orders.id,
  orders.name as title,
  'Purchased ' || to_char(orders.created, 'MM/DD/YY') || ' from ' || suppliers.name as description
FROM orders
JOIN suppliers
  ON suppliers.id = orders.supplier_id
WHERE orders.name ILIKE '%te%'



DROP INDEX IF EXISTS tickets_id_text_idx;
CREATE INDEX tickets_id_text_idx ON tickets (trim(to_char(id, '999999')));


DROP INDEX IF EXISTS houses_lot_lower_idx;
CREATE INDEX houses_lot_lower_idx ON houses (lower(lot));

DROP INDEX IF EXISTS subdivisions_name_lower_idx;
CREATE INDEX subdivisions_name_lower_idx ON subdivisions (lower(name));

DROP INDEX IF EXISTS builders_name_lower_idx;
CREATE INDEX builders_name_lower_idx ON builders (lower(name));

DROP INDEX IF EXISTS orders_name_lower_idx;
CREATE INDEX orders_name_lower_idx ON orders (lower(name));

