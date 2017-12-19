DROP TABLE IF EXISTS subdivisions CASCADE;
CREATE TABLE subdivisions (
    id serial NOT NULL,
    created timestamp DEFAULT current_timestamp NOT NULL,
    builder_id int REFERENCES builders(id) NOT NULL,
    name varchar(64) NOT NULL,
    zipcode_id int REFERENCES zipcodes (id),
    active BOOLEAN DEFAULT true NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE subdivisions RENAME COLUMN zip_id TO zipcode_id;
