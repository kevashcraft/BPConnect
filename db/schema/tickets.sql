DROP TABLE IF EXISTS ticket_types CASCADE;
CREATE TABLE ticket_types (
  id serial NOT NULL,
  created timestamp DEFAULT current_timestamp NOT NULL,
  type varchar(64) NOT NULL,
  needspermit boolean DEFAULT false NOT NULL,
  needspo boolean DEFAULT false NOT NULL,
  needsepo boolean DEFAULT false NOT NULL,
  needsimport boolean DEFAULT false NOT NULL,
  punch_id int,
  details varchar(32),
  payout decimal(9,2),
  PRIMARY KEY (id)
);

-- ALTER TABLE ticket_types ADD COLUMN details varchar(32);
-- ALTER TABLE ticket_types ADD COLUMN needsepo boolean DEFAULT false NOT NULL;

DROP TYPE fault IF EXISTS;
CREATE TYPE fault AS ENUM('bp', 'builder');

DROP TABLE IF EXISTS reasons CASCADE;
CREATE TABLE reasons (
  id serial NOT NULL,
  reason varchar(256) NOT NULL,
  fault fault DEFAULT 'bp' NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS tickets CASCADE;
CREATE TABLE tickets (
  id serial NOT NULL,
  parent_id int,
  child_id int,
  punch_id REFERENCES tickets(id),
  ticket_type_id int REFERENCES ticket_types(id),
  reason_id int REFERENCES reasons(id),
  house_id int REFERENCES houses(id) NOT NULL,
  bp_supervisor_id int REFERENCES users(id),
  builder_supervisor_id int REFERENCES builder_supervisors(id),
  bumped int DEFAULT 0 NOT NULL,
  needsimport boolean DEFAULT true NOT NULL,
  needspermit boolean DEFAULT true NOT NULL,
  needspo boolean DEFAULT true NOT NULL,
  created timestamp DEFAULT current_timestamp NOT NULL,
  scheduled date,
  imported timestamp,
  siteready timestamp,
  sentout timestamp,
  started timestamp,
  completed timestamp,
  walked timestamp,
  po varchar(128),
  epo varchar(128),
  total decimal(12,2),
  billed timestamp,
  paid decimal(12,2),
  lastpaid timestamp,
  waitingon varchar(256),
  payout decimal(9,2),
  valid boolean DEFAULT true NOT NULL,
  PRIMARY KEY (id)
);

-- ALTER TABLE tickets ADD COLUMN punch_id int REFERENCES tickets(id);
-- ALTER TABLE tickets ADD COLUMN sentout timestamp;
-- ALTER TABLE tickets ADD COLUMN needspo BOOLEAN default false NOT NULL;
-- ALTER TABLE tickets ADD COLUMN billed timestamp;
-- ALTER TABLE tickets ADD COLUMN po varchar(128);
-- ALTER TABLE tickets ADD COLUMN epo varchar(128);
-- ALTER TABLE tickets ADD COLUMN paid timestamp;
-- ALTER TABLE tickets RENAME COLUMN paid TO lastpaid;
-- ALTER TABLE tickets ADD COLUMN paid decimal(12,2);
-- ALTER TABLE tickets ADD COLUMN total decimal(12,2);

DROP TABLE IF EXISTS ticket_parts CASCADE;
CREATE TABLE ticket_parts (
  id serial NOT NULL,
  ticket_id int REFERENCES tickets(id) NOT NULL,
  room_id int REFERENCES house_rooms(id) NOT NULL,
  qty int NOT NULL,
  payout decimal(9,2) DEFAULT 0 NOT NULL,
  description varchar(256) NOT NULL,
  order_id int REFERENCES orders(id),
  created timestamp DEFAULT current_timestamp NOT NULL,
  updated timestamp,
  ordered timestamp,
  received timestamp,
  installed timestamp,
  walked timestamp,
  destroyed timestamp,
  deleted boolean DEFAULT false NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS ticket_tasks CASCADE;
CREATE TABLE ticket_tasks (
  id serial NOT NULL,
  created timestamp DEFAULT current_timestamp NOT NULL,
  ticket_id int REFERENCES tickets(id) NOT NULL,
  task varchar(2056),
  completed timestamp,
  walked timestamp,
  deleted boolean DEFAULT false NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS task_templates CASCADE;
CREATE TABLE task_templates (
  id serial NOT NULL,
  created timestamp DEFAULT current_timestamp NOT NULL,
  builder_id int REFERENCES builders(id),
  subdivision_id int REFERENCES subdivisions(id),
  ticket_type_id int REFERENCES ticket_types(id),
  county_id int REFERENCES counties(id),
  city_id int REFERENCES cities(id),
  task varchar(2056) NOT NULL,
  valid boolean DEFAULT true NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS ticket_part_files CASCADE;
CREATE TABLE ticket_part_files (
  id serial NOT NULL,
  created timestamp DEFAULT current_timestamp NOT NULL,
  ticket_part_id int REFERENCES ticket_parts(id) NOT NULL,
  file_id int REFERENCES files(id) NOT NULL,
  worker_id int REFERENCES workers(id) NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS ticket_workers CASCADE;
CREATE TABLE ticket_workers (
  ticket_id int REFERENCES tickets(id) NOT NULL,
  user_id int REFERENCES users(id) NOT NULL,
  type worker_type DEFAULT 'plumber' NOT NULL,
  split int DEFAULT 100 NOT NULL,
  UNIQUE (ticket_id, user_id)
);

DROP TABLE IF EXISTS ticket_pos CASCADE;
CREATE TABLE ticket_pos (
  id serial NOT NULL,
  created timestamp DEFAULT current_timestamp NOT NULL,
  ponumber varchar(64),
  epo boolean DEFAULT false NOT NULL,
  billed decimal(9,2),
  billedon date,
  paid decimal(9,2),
  paidon date,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS ticket_notes CASCADE;
CREATE TABLE ticket_notes (
  id serial NOT NULL,
  created timestamp DEFAULT current_timestamp NOT NULL,
  ticket_id int REFERENCES tickets(id) NOT NULL,
  worker_id int REFERENCES workers(id) NOT NULL,
  note text,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS ticket_details CASCADE;
CREATE TABLE ticket_details (
  ticket_id int REFERENCES tickets(id) NOT NULL,
  id serial NOT NULL,
  created timestamp DEFAULT current_timestamp NOT NULL,
  ponumber varchar(64),
  epo boolean DEFAULT false NOT NULL,
  billed decimal(9,2),
  billedon date,
  paid decimal(9,2),
  paidon date,
  PRIMARY KEY (id)
);

