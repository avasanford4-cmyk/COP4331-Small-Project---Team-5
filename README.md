# Tropical Travels - Contact Manager

**COP4331 Small Project - Team 5**

A LAMP-stack contact management web application hosted on a DigitalOcean droplet.

**Team:** Aidan Alich, Vaishal Devasenapathy, Brian Huang, Ava Sanford, George Morillo

**Live site:** http://tropicaltravels.info (Server: 142.93.67.135)

> This repository is a **mirror** of the droplet at `142.93.67.135`.

## Features

- User registration and login with MD5 password hashing
- Input validation (username length, password complexity)
- Session management via cookies (20-minute expiry)
- Contact CRUD: create, search, edit, and delete contacts
- Search contacts by first or last name
- Client-side validation for email and phone number
- Confirmation modal for contact deletion
- Animated transitions and toast notifications

## Tech Stack

- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** PHP
- **Database:** MySQL
- **Server:** Apache on Ubuntu (DigitalOcean droplet)

## Project Structure

```
/
├── DB [Not Mirrored]/          # SQL schema & seed data (not deployed to server)
│   ├── Tables/
│   │   ├── tbl_Users.sql       # Users table (ID, FirstName, LastName, Login, Password)
│   │   └── tbl_Contacts.sql    # Contacts table (ID, UserID, FirstName, LastName, Phone, Email)
│   ├── Seed Data - Run Once/   # Initial seed data
│   └── DO NOT RUN - DANGER - DROP tables/
│
├── html/                       # Maps to /var/www/html on the server
│   ├── index.html              # Login & registration page
│   ├── contacts.html           # Contact management page (requires auth)
│   ├── css/
│   │   └── styles.css
│   ├── images/
│   │   ├── background.jpg
│   │   ├── TropicalTravels.png # Splash screen logo
│   │   ├── closedshell.png     # Password toggle icon (hidden)
│   │   └── openshell.png       # Password toggle icon (visible)
│   ├── js/
│   │   ├── code.js             # All application logic (auth, CRUD, UI)
│   │   └── md5.js              # MD5 hashing library
│   ├── API/                    # PHP API endpoints
│   │   ├── Login.php           # POST - authenticate user
│   │   ├── Register.php        # POST - create new user
│   │   ├── SearchContacts.php  # POST - search contacts by name
│   │   ├── NewContact.php      # POST - add a contact
│   │   ├── EditContact.php     # POST - update a contact
│   │   └── DeleteContact.php   # POST - delete a contact
│   └── test [Not Mirrored]/    # Local test files
│
└── README.md
```

## API Endpoints

All endpoints accept `POST` requests with JSON bodies.

| Endpoint | Input | Description |
|---|---|---|
| `/API/Login.php` | `{ login, password }` | Authenticate a user |
| `/API/Register.php` | `{ firstName, lastName, login, password }` | Register a new user |
| `/API/SearchContacts.php` | `{ search, userId }` | Search contacts by first/last name |
| `/API/NewContact.php` | `{ FirstName, LastName, UserId, EmailAddress, PhoneNumber }` | Create a new contact |
| `/API/EditContact.php` | `{ id, userId, firstName, lastName, email, phone }` | Update an existing contact |
| `/API/DeleteContact.php` | `{ id, userId }` | Delete a contact |

## Database Schema

- **Users** — `ID`, `FirstName`, `LastName`, `Login`, `Password`
- **Contacts** — `ID`, `UserID` (FK → Users), `FirstName`, `LastName`, `PhoneNumber`, `EmailAddress`
