-- Seed Data for Contacts Table
-- Run this AFTER seed_Users.sql

INSERT INTO `COP4331`.`Contacts` (`UserID`, `FirstName`, `LastName`, `PhoneNumber`, `EmailAddress`) VALUES
-- Contacts for User 1 (John Doe)
(1, 'Alice', 'Brown', '555-123-4567', 'alice.brown@email.com'),
(1, 'Bob', 'Miller', '555-234-5678', 'bob.miller@email.com'),
(1, 'Carol', 'Taylor', '555-345-6789', 'carol.taylor@email.com'),

-- Contacts for User 2 (Jane Smith)
(2, 'David', 'Anderson', '555-456-7890', 'david.anderson@email.com'),
(2, 'Eva', 'Thomas', '555-567-8901', 'eva.thomas@email.com'),

-- Contacts for User 3 (Mike Johnson)
(3, 'Frank', 'Jackson', '555-678-9012', 'frank.jackson@email.com'),
(3, 'Grace', 'White', '555-789-0123', 'grace.white@email.com'),
(3, 'Henry', 'Harris', '555-890-1234', 'henry.harris@email.com'),
(3, 'Ivy', 'Martin', '555-901-2345', 'ivy.martin@email.com'),

-- Contacts for User 4 (Emily Davis)
(4, 'Jack', 'Garcia', '555-012-3456', 'jack.garcia@email.com'),
(4, 'Karen', 'Martinez', '555-111-2222', 'karen.martinez@email.com'),

-- Contacts for User 5 (Chris Wilson)
(5, 'Leo', 'Robinson', '555-333-4444', 'leo.robinson@email.com'),
(5, 'Mia', 'Clark', '555-555-6666', 'mia.clark@email.com'),
(5, 'Nathan', 'Lewis', '555-777-8888', 'nathan.lewis@email.com');
