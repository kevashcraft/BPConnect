INSERT INTO user_roles (id, role) VALUES
    (0, 'none'),
    (1, 'root'),
    (2, 'owner'),
    (3, 'accountant'),
    (4, 'scheduler'),
    (5, 'supervisor'),
    (6, 'plumber');

UPDATE users
SET
  type = 'root',
  fname = 'Kevin',
  lname = 'Ashcraft',
  password = '$2y$10$nIm1zohwB2OEP0Q/ZJfWRe1UfYYqKTBy.fTwzzTAjB7fiaN878RGC'
WHERE username = 'kevin';

INSERT INTO worker_roles (role) VALUES
('Supervisor'),
('Plumber'),
('Helper'),
('Warehouse');
