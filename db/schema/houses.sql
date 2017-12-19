DROP TABLE IF EXISTS houses CASCADE;
CREATE TABLE houses (
    id serial NOT NULL,
    created timestamp DEFAULT current_timestamp NOT NULL,
    subdivision_id int REFERENCES subdivisions(id) NOT NULL,
    lot varchar(64),
    address varchar(256),
    garageside char(1),
    active BOOLEAN DEFAULT true NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS house_rooms CASCADE;
CREATE TABLE house_rooms (
    id serial NOT NULL,
    created timestamp DEFAULT current_timestamp NOT NULL,
    house_id int REFERENCES houses(id) NOT NULL,
    name varchar(64) NOT NULL,
    color varchar(16),
    tubside char(1),
    active BOOLEAN DEFAULT true NOT NULL,
    PRIMARY KEY (id)
);
