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

-- DROP TABLE IF EXISTS ticket_part_files CASCADE;
-- CREATE TABLE ticket_part_files (
--   id serial NOT NULL,
--   created timestamp DEFAULT current_timestamp NOT NULL,
--   ticket_part_id int REFERENCES ticket_parts(id) NOT NULL,
--   file_id int REFERENCES files(id) NOT NULL,
--   worker_id int REFERENCES workers(id) NOT NULL,
--   PRIMARY KEY (id)
-- );
