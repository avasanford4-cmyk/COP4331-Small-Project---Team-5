CREATE TABLE `COP4331`.`Contacts`
(
    `ID` INT NOT NULL AUTO_INCREMENT,
    `UserID` INT NOT NULL,
    `FirstName` VARCHAR(50) NOT NULL,
    `LastName` VARCHAR(50) NOT NULL,
    `PhoneNumber` VARCHAR(30) NOT NULL DEFAULT '',
    `EmailAddress` VARCHAR(100) NOT NULL DEFAULT '',
    PRIMARY KEY (ID),
    KEY idx_UserID (UserID),
    KEY idx_Name (LastName, FirstName),
    CONSTRAINT fk_Contacts_Users
        FOREIGN KEY (UserID)
        REFERENCES Users(ID)
        ON DELETE CASCADE
) ENGINE=InnoDB;
