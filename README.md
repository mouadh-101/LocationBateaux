# 🌊 Boat Rental Web Platform

> Internship Project - 2 Students - Duration: 2 Months  
> Technologies: Spring Boot (Java) | Angular (TypeScript) | PostgreSQL | Git

---

## 🚀 Project Overview

This project aims to develop a **web platform for boat rental**, allowing users to:

- Search for boats based on filters (type, price, availability)
- View detailed boat profiles (photos, descriptions, price, maintenance status
- Book a boat with start and end dates
- View booking history from their user dashboard
- Simulate payments (future integrations: Clicktopay Tunisia, PayPal Dubai)
- Track reservation history and statuses

The application also includes a **multi-role access system**:  
`Client`, `Manager`, `Administrator`.

---

## 🧩 Features

### 👤 User Features (Frontend - Angular)

- **Authentication**: Register / Login (email-password)
- **Boat Search**: Filters by type, availability, and price
- **Boat Details**: View photos, description, maintenance status, and reviews
- **Reservation**: Choose date range and book a boat
- **Simulated Payment**: Choose method and process payment (status managed)
- **User Dashboard**: View reservation history and status
- **Reviews**: Submit and read comments on boats
- **Notifications**: Receive updates about reservation status

### 👨‍💼 Admin Features (Backend - Spring Boot)


- **Boat Management**: CRUD operations on boats
- **User Management**: View, block, or update user roles
- **Reservation Validation**: Accept or reject pending reservations
- **Maintenance Tracking**: Add or update boat maintenance records
- **Notification System**: Send reservation or system notifications

---

## 🗃️ Database (PostgreSQL)

### Main Tables:
- `Users (id, name, email, password, role)`
- `Boats (id, name, description, price, availability, images)`
- `Reservations (id, user_id, boat_id, date, status)`
- `Paiement (id, montant, méthode, status)`
- `Image (id, url)`
- `Avis(id, note, commentaire, dateCreation)`
- `Maintenance(id, description, dateDebut, dateFin)`
- `Notification(id, message, dateEnvoi)`

---

## 🛠️ Technologies Used

| Layer        | Technology                                                             |
|--------------|------------------------------------------------------------------------|
| Backend      | Spring Boot, Spring Security, JPA/Hibernate, Spring Mail              |
| Frontend     | Angular, Bootstrap, HTML/CSS                                           |
| Database     | PostgreSQL                                                             |
| Versioning   | Git (GitHub/GitLab)                                                    |
| Deployment   | Docker *(optional)*                                                    |

---

## 📁 Project Structure

/BoatRentalPlatform
├── /BackEnd --> Spring Boot (API, Entities, Repositories, Services, Controllers)
└── /FrontEnd --> Angular (Components, Services, Routing, UI)


---

## 📌 Current Status

- ✅ Spring Boot project initialized in `/BackEnd`
- ✅ Dependencies configured: JPA, Lombok, PostgreSQL, Web
- ✅ Entity modeling started
- ⏳ Database schema design in progress
- ⏳ API development (authentication, boat & reservation management)
- ⏳ Angular frontend to be initialized in `/FrontEnd`

---

## 👨‍💻 Contributors

- Mouadh Gammoudi  
- Hedi Latrache

---

> This README will be updated as development progresses.

