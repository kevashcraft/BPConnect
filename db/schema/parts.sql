DROP TABLE IF EXISTS suppliers CASCADE;
CREATE TABLE suppliers (
    id serial NOT NULL,
    created timestamp DEFAULT current_timestamp NOT NULL,
    name varchar(64) NOT NULL,
    address varchar(256),
    zipcode_id int REFERENCES zips(id),
    phone varchar(32),
    fax varchar(32),
    email varchar(32),
    deleted BOOLEAN DEFAULT false NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
    id serial NOT NULL,
    created timestamp DEFAULT current_timestamp NOT NULL,
    ordered timestamp,
    supplier_id int REFERENCES suppliers(id) NOT NULL,
    name varchar(64),
    order_number varchar(256),
    PRIMARY KEY (id)
);

DROP VIEW IF EXISTS orders_view CASCADE;
CREATE VIEW orders_view AS
    orders.id as order_id,
    orders.order_number,
    orders.total as total_cost,
    orders.created as date_created,
    coalesce(orders.ordered, '<a href="#place_order">Place Order</a>') as date_ordered,

    orders.created as date_created,
SELECT







