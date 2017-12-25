DROP TABLE IF EXISTS suppliers CASCADE;
CREATE TABLE suppliers (
    id serial NOT NULL,
    created timestamp DEFAULT current_timestamp NOT NULL,
    name varchar(64) NOT NULL,
    address varchar(256),
    zip_id int REFERENCES zips(id),
    phone varchar(32),
    fax varchar(32),
    email varchar(32),
    active BOOLEAN DEFAULT true NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
    id serial NOT NULL,
    created timestamp DEFAULT current_timestamp NOT NULL,
    ordered date,
    supplier_id int REFERENCES suppliers(id) NOT NULL,
    ticket_id int REFERENCES tickets(id),
    total decimal(12,3),
    name varchar(128),
    PRIMARY KEY (id)
);
