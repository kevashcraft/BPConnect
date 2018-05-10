DROP TABLE IF EXISTS builders CASCADE;
CREATE TABLE builders (
    id serial NOT NULL,
    created timestamp DEFAULT current_timestamp NOT NULL,
    name varchar(64) NOT NULL,
    address varchar(256),
    zipcode_id int REFERENCES zipcodes(id),
    phone varchar(32),
    fax varchar(32),
    email varchar(32),
    deleted BOOLEAN DEFAULT false NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS builder_supervisors CASCADE;
CREATE TABLE builder_supervisors (
    id serial NOT NULL,
    created timestamp DEFAULT current_timestamp NOT NULL,
    builder_id int REFERENCES builders(id) NOT NULL,
    name varchar(64) NOT NULL,
    phone varchar(128),
    email varchar(128),
    deleted BOOLEAN DEFAULT false NOT NULL,
    PRIMARY KEY (id)
);
