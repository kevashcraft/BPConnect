#!/bin/bash
set -e

cd $PGINIT_DIR

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE USER $DB_NAME WITH PASSWORD '$DB_NAME';
  CREATE DATABASE $DB_NAME;
  GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_NAME;
  \c $DB_NAME
  CREATE EXTENSION pg_trgm;
  SET ROLE $DB_NAME;
  \i schema/locations.sql
  \i schema/users.sql
  \i schema/builders.sql
  \i schema/houses.sql
  \i schema/tickets.sql
  \i schema/orders.sql
  \i schema/ticket_parts.sql
  \i schema/permits.sql

  -- \i data/users.sql
  \i data/ticket_types.sql
EOSQL
