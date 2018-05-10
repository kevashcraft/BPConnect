DROP TYPE IF EXISTS user_type;
CREATE TYPE user_type AS ENUM(
    'root','owner','administrator','billing','accounting','scheduling',
    'supervisor', 'plumber', 'helper', 'user');

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id serial NOT NULL,
    created timestamp DEFAULT current_timestamp NOT NULL,
    first_name varchar(64),
    last_name varchar(64),
    username varchar(16) NOT NULL,
    email varchar(64),
    phone varchar(16),
    address varchar(128),
    first_day date,
    last_day date,
    type user_type DEFAULT 'user' NOT NULL,
    password char(60) NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    PRIMARY KEY (id),
    unique (username)
);

DROP TYPE IF EXISTS worker_type CASCADE;
CREATE TYPE worker_type AS ENUM('plumber', 'helper', 'supervisor');

DROP TABLE IF EXISTS workers CASCADE;
CREATE TABLE workers (
    user_id int REFERENCES users(id) NOT NULL,
    type worker_type DEFAULT 'plumber' NOT NULL,
    UNIQUE (user_id, type)
);
