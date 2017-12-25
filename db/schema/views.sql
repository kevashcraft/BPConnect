DROP VIEW IF EXISTS tickets_master_view CASCADE;
CREATE VIEW tickets_master_view AS
  SELECT DISTINCT ON (tickets.id)
    tickets.id as ticket_id,
    tickets.parent_id,
    tickets.child_id,
    tickets.punch_id,
    ticket_types.type as ticket_type,
    tickets.house_id,
    tickets.bp_supervisor_id,
    tickets.builder_supervisor_id,
    tickets.po as ticket_po,
    tickets.epo as ticket_epo,
    tickets.total as ticket_total,
    tickets.paid as ticket_paid,
    tickets.billed as ticket_billed,
    tickets.lastpaid as ticket_lastpaid,
    tickets.created as ticket_date_created,
    tickets.scheduled as ticket_date_scheduled,
    tickets.walked as ticket_date_walked,
    tickets.sentout as ticket_date_sentout,
    tickets.started as ticket_date_started,
    tickets.completed as ticket_date_completed,
    tickets.imported as ticket_date_imported,
    tickets.ready as ticket_date_ready,
    TO_CHAR(tickets.created, 'MM/DD/YY') as ticket_date_created_formatted,
    TO_CHAR(tickets.scheduled, 'MM/DD/YY') as ticket_date_scheduled_formatted,
    TO_CHAR(tickets.walked, 'MM/DD/YY') as ticket_date_walked_formatted,
    TO_CHAR(tickets.sentout, 'MM/DD/YY') as ticket_date_sentout_formatted,
    TO_CHAR(tickets.started, 'MM/DD/YY') as ticket_date_started_formatted,
    TO_CHAR(tickets.completed, 'MM/DD/YY') as ticket_date_completed_formatted,
    TO_CHAR(tickets.imported, 'MM/DD/YY') as ticket_date_imported_formatted,
    TO_CHAR(tickets.ready, 'MM/DD/YY') as ticket_date_ready_formatted,
    tickets.payout as payout_total,
    tickets.needsimport as ticket_needsimport,
    tickets.needspermit as ticket_needspermit,
    tickets.bumped as bumped_count,
    builders.name as builder_name,
    builders.email as builder_email,
    subdivisions.name as subdivision_name,
    subdivisions.builder_id,
    houses.subdivision_id,
    houses.lot as house_lot,
    houses.address as house_address,
    zipcitystatecounty.zip_id as house_zip_id,
    zipcitystatecounty.zip as house_zip,
    zipcitystatecounty.county as house_county,
    zipcitystatecounty.county_id as house_county_id,
    zipcitystatecounty.city as house_city,
    zipcitystatecounty.city_id as house_city_id,
    zipcitystatecounty.state as house_state,
    zipcitystatecounty.state_id as house_state_id,
    builder_supervisors.name as builder_supervisor,
    site_reasons.reason as site_reason,
    supervisor.fname || ' ' || supervisor.lname as supervisor_name,
    plumber.fname || ' ' || plumber.lname as plumber_name,
    plumber.id as plumber_id,
    helper.fname || ' ' || helper.lname as helper_name,
    helper.id as helper_id
  FROM tickets
  LEFT JOIN ticket_types
    ON ticket_types.id = tickets.ticket_type_id
  LEFT JOIN ticket_workers
    ON ticket_workers.ticket_id = tickets.id
  LEFT JOIN ticket_workers ticket_plumbers
    ON ticket_plumbers.ticket_id = tickets.id
      AND ticket_plumbers.type = 'plumber'
  LEFT JOIN users plumber
    ON plumber.id = ticket_plumbers.user_id
  LEFT JOIN ticket_workers ticket_helpers
    ON ticket_helpers.ticket_id = tickets.id
      AND ticket_helpers.type = 'helper'
  LEFT JOIN users helper
    ON helper.id = ticket_helpers.user_id
  LEFT JOIN houses
    ON houses.id = tickets.house_id
  LEFT JOIN subdivisions
    ON subdivisions.id = houses.subdivision_id
  LEFT JOIN zipcitystatecounty
    ON zipcitystatecounty.zip_id = subdivisions.zipcode_id
  LEFT JOIN builders
    ON builders.id = subdivisions.builder_id
  LEFT JOIN builder_supervisors
    ON builder_supervisors.id = tickets.builder_supervisor_id
  LEFT JOIN users as supervisor
    ON supervisor.id = tickets.bp_supervisor_id
  LEFT JOIN reasons as site_reasons
    ON tickets.reason_id = site_reasons.id
  ORDER BY tickets.id;

DROP VIEW IF EXISTS billing_view;
CREATE VIEW billing_view AS
  SELECT
    tickets_master_view.*,
    CASE WHEN tickets_master_view.ticket_total IS NULL
      THEN '<a href="#set_total">Set Total</a>'
      ELSE tickets_master_view.ticket_total::money || ' <a href="#set_total"><i class="edit icon"></i></a>'
    END as ticket_total_html,
    CASE WHEN tickets_master_view.ticket_total IS NOT NULL
      AND tickets_master_view.ticket_billed IS NULL
      THEN '<a href="#bill_ticket">Bill</a>'
      ELSE tickets_master_view.ticket_billed::text || ' <a href="#bill_ticket"><i class="edit icon"></i></a>'
    END as ticket_billed_html,
    CASE WHEN tickets_master_view.ticket_total IS NOT NULL
      AND tickets_master_view.ticket_lastpaid IS NULL
      THEN '<a href="#ticket_paid">Paid</a>'
      ELSE tickets_master_view.ticket_paid::money || ' <a href="#ticket_paid"><i class="edit icon"></i></a>'
    END as ticket_paid_html
  FROM tickets_master_view
  WHERE tickets_master_view.ticket_po IS NOT NULL
    OR tickets_master_view.ticket_epo IS NOT NULL;

CREATE VIEW inspections_view AS
  SELECT
    tickets_master_view.*,
    inspections.id as inspection_id,
    CASE WHEN inspections.scheduled IS NULL
      THEN '<a href="#schedule_inspection">Schedule</a>'
      ELSE TO_CHAR(inspections.scheduled, 'MM/DD/YY')
    END as inspection_date_scheduled_html,
    inspections.scheduled as inspection_date_scheduled,
    CASE WHEN inspections.scheduled IS NOT NULL
      AND inspections.passed IS NULL
      AND inspections.failed IS NULL
      THEN '<a href="#pass_inspection">Passed</a>'
      ELSE TO_CHAR(inspections.passed, 'MM/DD/YY')
    END as inspection_date_passed_html,
    inspections.passed as inspection_date_passed,
    CASE WHEN inspections.scheduled IS NOT NULL
      AND inspections.passed IS NULL
      AND inspections.failed IS NULL
      THEN '<a href="#fail_inspection">Failed</a>'
      ELSE TO_CHAR(inspections.failed, 'MM/DD/YY')
    END as inspection_date_failed_html,
    inspections.failed as inspection_date_failed,
    inspections.created as inspection_date_created,
    permits.id as permit_id,
    permits.created as permit_date_created,
    TO_CHAR(permits.created, 'MM/DD/YY') as permit_date_created_formatted,
    permits.name as permit_number,
    permits.starts as permit_date_starts,
    TO_CHAR(permits.starts, 'MM/DD/YY') as permit_date_starts_formatted,
    permits.ends as permit_date_ends,
    TO_CHAR(permits.ends, 'MM/DD/YY') as permit_date_ends_formatted,
    inspectors.name as inspector_name,
    inspectors.id as inspector_id
  FROM tickets_master_view
  RIGHT JOIN permits
    ON tickets_master_view.house_id = permits.house_id
  RIGHT JOIN inspections
    ON inspections.permit_id = permits.id
  LEFT JOIN inspectors
    ON inspectors.id = permits.inspector_id
  WHERE tickets_master_view.ticket_needspermit;

DROP VIEW IF EXISTS orders_view CASCADE;
CREATE VIEW orders_view AS
  SELECT
    tickets_master_view.*,
    orders.id as order_id,
    coalesce(orders.name::text, '<a href="#order_parts">Order Parts</a>') as order_number_html,
    orders.total as total_cost,
    orders.created as date_created,
    TO_CHAR(orders.created, 'MM/DD/YY') as date_created_formatted,
    orders.ordered as date_ordered,
    TO_CHAR(orders.ordered, 'MM/DD/YY') as date_ordered_formatted,
    suppliers.id as supplier_id,
    suppliers.name as supplier_name,
    total_parts.item_count,
    '<a href="#parts_received">' || ((coalesce(received_parts.received_count::numeric, 0) / total_parts.item_count::numeric) * 100)::int || '%</a>' as received_percent
  FROM tickets_master_view
  LEFT JOIN (
      SELECT ticket_id, order_id, count(*) as item_count
      FROM ticket_parts
      GROUP BY ticket_id, order_id
    ) total_parts ON total_parts.ticket_id = tickets_master_view.ticket_id
  LEFT JOIN (
    SELECT order_id, count(*) as received_count
    FROM ticket_parts
    WHERE received IS NOT NULL
    GROUP BY order_id
  ) received_parts
    ON received_parts.order_id = total_parts.order_id
  LEFT JOIN orders
    ON orders.id = total_parts.order_id
  LEFT JOIN suppliers
    ON suppliers.id = orders.supplier_id;



DROP VIEW IF EXISTS permits_view;
CREATE VIEW permits_view AS
  SELECT DISTINCT ON (permits.id)
    permits.id as permit_id,
    tickets_master_view.*,
    coalesce(permits.name::text, '<a href="#permit_add">Add Permit</a>') as permit_number,
    permits.created as permit_date_created,
    permits.starts as permit_date_starts,
    TO_CHAR(permits.starts, 'MM/DD/YY') as permit_date_starts_formatted,
    permits.ends as permit_date_ends,
    TO_CHAR(permits.ends, 'MM/DD/YY') as permit_date_ends_formatted,
    permits.starts <= current_date AND permits.ends >= current_date as permit_valid,
    inspectors.name as inspector_name,
    inspectors.id as inspector_id
  FROM tickets_master_view
  RIGHT JOIN permits
    ON permits.house_id = tickets_master_view.house_id
  LEFT JOIN inspectors
    ON inspectors.id = permits.inspector_id
  WHERE tickets_master_view.ticket_needspermit;


DROP VIEW IF EXISTS schedule_view CASCADE;
CREATE VIEW schedule_view AS
  SELECT DISTINCT ON (tickets_master_view.ticket_id)
    tickets_master_view.*,
    CASE WHEN tickets_master_view.ticket_date_scheduled IS NOT NULL
      THEN tickets_master_view.ticket_date_scheduled_formatted || '<a href="#update_schedule"><i class="edit icon"></i></a>'
      ELSE '<a href="#update_schedule">Schedule</a>'
    END  as ticket_date_scheduled_html,
    CASE WHEN tickets_master_view.ticket_date_sentout IS NOT NULL
      THEN tickets_master_view.ticket_date_sentout_formatted || '<a href="#update_schedule"><i class="edit icon"></i></a>'
      ELSE '<a href="#sendout_ticket">Send Out</a>'
    END  as ticket_date_sentout_html,
    CASE WHEN tickets_master_view.plumber_name IS NOT NULL
      THEN tickets_master_view.plumber_name || '<a href="#update_workers"><i class="edit icon"></i></a>'
      ELSE '<a href="#update_workers">Add Plumber</a>'
    END as plumber_name_html,
    CASE WHEN tickets_master_view.helper_name IS NOT NULL
      THEN tickets_master_view.helper_name || '<a href="#update_workers"><i class="edit icon"></i></a>'
      ELSE '<a href="#update_workers">Add Helper</a>'
    END as helper_name_html
  FROM tickets_master_view;

DROP VIEW IF EXISTS sites_view CASCADE;
CREATE VIEW sites_view AS
  SELECT
    tickets_master_view.*,
    CASE WHEN tickets_master_view.ticket_date_ready IS NULL
      THEN '<a href="#site_ready">Not Ready</a>'
      ELSE tickets_master_view.ticket_date_ready_formatted || '<a href="#site_ready"><i class="edit icon"></i></a>'
    END as ticket_date_ready_html
  FROM tickets_master_view;

DROP VIEW IF EXISTS tickets_view CASCADE;
CREATE VIEW tickets_view AS
  SELECT
    tickets_master_view.*,
    '<a href="#' || tickets_master_view.ticket_id || '" class="ticket_id">' || tickets_master_view.ticket_id || '</a>' AS ticket_id_html,
    CASE
      WHEN tickets_master_view.ticket_needsimport = false
        THEN 'N/A'
      WHEN tickets_master_view.ticket_needsimport = true AND tickets_master_view.ticket_date_imported IS NULL
        THEN '<a href="#import_data">Import</a>'
      ELSE tickets_master_view.ticket_date_imported_formatted
    END as ticket_date_imported_html,
    '<a href="/tickets/print/' || tickets_master_view.ticket_id || '" target="_blank">Print</a>' as print_ticket_html
  FROM tickets_master_view;

DROP VIEW IF EXISTS wip_view;
CREATE VIEW wip_view AS
  SELECT
    tickets_master_view.*,
    CASE WHEN tickets_master_view.ticket_date_started IS NULL
      THEN '<a href="#start_work">Start Work</a>'
      ELSE tickets_master_view.ticket_date_started_formatted
    END as ticket_date_started_html,
    CASE WHEN tickets_master_view.ticket_date_completed IS NULL
      THEN '<a href="#checkin_work">Checkin</a>'
      ELSE tickets_master_view.ticket_date_completed_formatted
    END as ticket_date_completed_html,
    CASE WHEN tickets_master_view.ticket_date_walked IS NULL
      THEN '<a href="#walk_ticket">Walk Ticket</a>'
      ELSE tickets_master_view.ticket_date_walked_formatted
    END as ticket_date_walked_html
  FROM tickets_master_view
  WHERE tickets_master_view.ticket_date_sentout IS NOT NULL
    AND tickets_master_view.ticket_date_walked IS NULL;

DROP VIEW IF EXISTS tickets_master_view2 CASCADE;
DROP MATERIALIZED VIEW IF EXISTS tickets_master_view2 CASCADE;
CREATE MATERIALIZED VIEW tickets_master_view2 AS
  SELECT
    tickets.id as ticket_id,
    tickets.parent_id,
    tickets.child_id,
    tickets.punch_id,
    tickets.ticket_type_id,
    ticket_types.type as ticket_type,
    tickets.house_id,
    houses.lot as house_lot,
    houses.address as house_address,
    locations.zipcode_id as house_zip_id,
    locations.zipcode as house_zip,
    locations.county as house_county,
    locations.county_id as house_county_id,
    locations.city as house_city,
    locations.city_id as house_city_id,
    locations.state as house_state,
    locations.state_id as house_state_id,
    subdivisions.id as subdivision_id,
    subdivisions.name as subdivision_name,
    builders.id as builder_id,
    builders.name as builder_name,
    builders.email as builder_email,
    builder_supervisors.name as builder_supervisor,
    tickets.bp_supervisor_id,
    tickets.builder_supervisor_id,
    tickets.bumped as bumped_count,
    site_reasons.reason as site_reason,
    supervisor.fname || ' ' || supervisor.lname as supervisor_name,
    plumber.fname || ' ' || plumber.lname as plumber_name,
    plumber.id as plumber_id,
    helper.fname || ' ' || helper.lname as helper_name,
    helper.id as helper_id,
    tickets.po as ticket_po,
    tickets.epo as ticket_epo,
    tickets.total as ticket_total,
    tickets.paid as ticket_paid,

    tickets.created as ticket_date_created,
    tickets.imported as ticket_date_imported,
    tickets.scheduled as ticket_date_scheduled,
    tickets.ready as ticket_date_ready,
    tickets.sentout as ticket_date_sentout,
    tickets.started as ticket_date_started,
    tickets.completed as ticket_date_completed,
    tickets.walked as ticket_date_walked,
    tickets.billed as ticket_date_billed,
    tickets.lastpaid as ticket_date_lastpaid,

    TO_CHAR(tickets.created, 'MM/DD/YY') as ticket_date_created_formatted,
    TO_CHAR(tickets.imported, 'MM/DD/YY') as ticket_date_imported_formatted,
    TO_CHAR(tickets.scheduled, 'MM/DD/YY') as ticket_date_scheduled_formatted,
    TO_CHAR(tickets.ready, 'MM/DD/YY') as ticket_date_ready_formatted,
    TO_CHAR(tickets.sentout, 'MM/DD/YY') as ticket_date_sentout_formatted,
    TO_CHAR(tickets.started, 'MM/DD/YY') as ticket_date_started_formatted,
    TO_CHAR(tickets.completed, 'MM/DD/YY') as ticket_date_completed_formatted,
    TO_CHAR(tickets.walked, 'MM/DD/YY') as ticket_date_walked_formatted,
    TO_CHAR(tickets.billed, 'MM/DD/YY') as ticket_date_billed_formatted,
    TO_CHAR(tickets.lastpaid, 'MM/DD/YY') as ticket_data_lastpaid_formatted,

    tickets.payout as payout_total,
    tickets.needsimport as ticket_needsimport,
    tickets.needspermit as ticket_needspermit,

    string_agg(orders.name, ',') as orders,
    json_agg(orders.*) as orders_json,

    string_agg(permits.name, ',') as permits,
    json_agg(permits.*) as permits_json,

    string_agg(
      CASE
        WHEN inspections.passed IS NOT NULL THEN
          TO_CHAR(inspections.passed, 'MM/DD/YY') || ' (passed)'
        WHEN inspections.failed IS NOT NULL THEN
          TO_CHAR(inspections.failed, 'MM/DD/YY') || ' (failed)'
        ELSE
          TO_CHAR(inspections.scheduled, 'MM/DD/YY') || ' (scheduled)'
      END, ',') as inspections,
    json_agg(inspections.*) as inspections_json
  FROM tickets
  LEFT JOIN ticket_types ON ticket_types.id = tickets.ticket_type_id
  LEFT JOIN ticket_workers ON ticket_workers.ticket_id = tickets.id
  LEFT JOIN ticket_workers ticket_plumbers ON
    ticket_plumbers.ticket_id = tickets.id
    AND ticket_plumbers.type = 'plumber'
  LEFT JOIN users plumber ON plumber.id = ticket_plumbers.user_id
  LEFT JOIN ticket_workers ticket_helpers ON
    ticket_helpers.ticket_id = tickets.id
    AND ticket_helpers.type = 'helper'
  LEFT JOIN users helper ON helper.id = ticket_helpers.user_id
  LEFT JOIN houses ON houses.id = tickets.house_id
  LEFT JOIN subdivisions ON subdivisions.id = houses.subdivision_id
  LEFT JOIN locations ON locations.zipcode_id = subdivisions.zipcode_id
  LEFT JOIN builders ON builders.id = subdivisions.builder_id
  LEFT JOIN builder_supervisors ON builder_supervisors.id = tickets.builder_supervisor_id
  LEFT JOIN users as supervisor ON supervisor.id = tickets.bp_supervisor_id
  LEFT JOIN reasons as site_reasons ON tickets.reason_id = site_reasons.id
  LEFT JOIN orders ON orders.ticket_id = tickets.id
  LEFT JOIN permits ON permits.house_id = houses.id
  LEFT JOIN inspections ON inspections.ticket_id = tickets.id
  GROUP BY
    tickets.id,
    ticket_types.id,
    subdivisions.id,
    houses.id,
    locations.zipcode_id,
    locations.zipcode,
    locations.city_id,
    locations.city,
    locations.county_id,
    locations.county,
    locations.state_id,
    locations.state,
    builders.id,
    builder_supervisors.name,
    site_reasons.reason,
    supervisor.fname || ' ' || supervisor.lname,
    plumber.id,
    helper.id
  ORDER BY tickets.id
;
