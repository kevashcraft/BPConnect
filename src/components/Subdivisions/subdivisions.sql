DROP TABLE IF EXISTS subdivisions CASCADE;
CREATE TABLE subdivisions (
    id serial NOT NULL,
    created timestamp DEFAULT current_timestamp NOT NULL,
    builder_id int REFERENCES builders(id) NOT NULL,
    name varchar(64) NOT NULL,
    zipcode_id int REFERENCES zipcodes (id),
    deleted BOOLEAN DEFAULT false NOT NULL,
    PRIMARY KEY (id)
);
