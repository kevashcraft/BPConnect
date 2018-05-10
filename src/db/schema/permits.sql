DROP TABLE IF EXISTS inspectors CASCADE;
CREATE TABLE inspectors (
    id serial NOT NULL,
    created timestamp DEFAULT current_timestamp NOT NULL,
    name varchar(64) NOT NULL,
    address varchar(256),
    zipcode_id int REFERENCES zipcodes(id),
    email varchar(128),
    phone varchar(32),
    fax varchar(32),
    url varchar(256),
    deleted BOOLEAN DEFAULT false NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS inspector_zips CASCADE;
CREATE TABLE inspector_zips (
    inspector_id int REFERENCES inspectors(id) NOT NULL,
    zipcode_id int REFERENCES zipcodes(id) NOT NULL
);

DROP TABLE IF EXISTS permits CASCADE;
CREATE TABLE permits (
    id serial NOT NULL,
    created timestamp DEFAULT current_timestamp NOT NULL,
    starts date,
    ends date,
    inspector_id int REFERENCES inspectors(id),
    house_id int REFERENCES houses(id) NOT NULL,
    name varchar(128),
    PRIMARY KEY (id)
);

-- ALTER TABLE permits ALTER inspector_id DROP NOT NULL;
-- ALTER TABLE permits ALTER name DROP NOT NULL;

DROP TABLE IF EXISTS inspections CASCADE;
CREATE TABLE inspections (
    id serial NOT NULL,
    created timestamp DEFAULT current_timestamp NOT NULL,
    scheduled date,
    permit_id int REFERENCES permits(id) NOT NULL,
    ticket_id int REFERENCES tickets(id) NOT NULL,
    passed timestamp,
    failed timestamp,
    PRIMARY KEY (id)
);
