CREATE TABLE IF NOT EXISTS tbl_Users
(
    ID INT NOT NULL AUTO_INCREMENT,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Login VARCHAR(50) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    PRIMARY KEY (ID),
    UNIQUE KEY uq_Login (Login)
) ENGINE=InnoDB;
-- This table stores user information including first name, last name, login, and password.