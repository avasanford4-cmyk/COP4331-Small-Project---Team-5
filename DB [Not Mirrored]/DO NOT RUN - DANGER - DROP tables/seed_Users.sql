-- Seed Data for Users Table
-- Run this BEFORE seed_Contacts.sql

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `COP4331`.`Contacts`;
TRUNCATE TABLE `COP4331`.`Users`;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO `COP4331`.`Users` (`FirstName`, `LastName`, `Login`, `Password`) VALUES
('John', 'Doe', 'johndoe', '482c811da5d5b4bc6d497ffa98491e38'),
('Jane', 'Smith', 'janesmith', '73a054cc528f91ca1bbdda3589b6a22d'),
('Mike', 'Johnson', 'mikej', '4363527e0e1f507ec74dcbd875ad74b3'),
('Emily', 'Davis', 'emilyd', '976145ad2021e4775823e5d7f4bbe1a1'),
('Chris', 'Wilson', 'chrisw', 'b3d904f10a0e6761186967297bd89813');
