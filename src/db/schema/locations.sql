DROP TABLE IF EXISTS states CASCADE;
CREATE TABLE states (
    id serial NOT NULL,
    state varchar(64),
    abv char(2),
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS counties CASCADE;
CREATE TABLE counties (
    id serial NOT NULL,
    county varchar(64),
    state_id int REFERENCES states(id) NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS cities CASCADE;
CREATE TABLE cities (
    id serial NOT NULL,
    city varchar(64),
    county_id int REFERENCES counties(id) NOT NULL,
    state_id int REFERENCES states(id) NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS zipcodes CASCADE;
CREATE TABLE zipcodes (
    id serial NOT NULL,
    zipcode char(5),
    city_id int REFERENCES cities(id) NOT NULL,
    PRIMARY KEY (id)
);

DROP MATERIALIZED VIEW IF EXISTS locations;
CREATE MATERIALIZED VIEW locations AS
SELECT
  cities.city || ', ' || states.state || ' ' || zipcodes.zipcode as location,
  zipcodes.id as zipcode_id,
  zipcodes.zipcode,
  cities.id as city_id,
  cities.city,
  counties.id as county_id,
  counties.county,
  states.id as state_id,
  states.state,
  cities.city || ', ' || states.state as citystate
FROM zipcodes
JOIN cities ON
  cities.id = zipcodes.city_id
JOIN counties ON
  counties.id = cities.county_id
JOIN states ON
  states.id = cities.state_id
GROUP BY
  zipcodes.id,
  cities.id,
  counties.id,
  states.id
;
