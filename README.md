# 🌊 Boat Rental Web Platform

> Internship Project - 2 Students - Duration: 2 Months  
> Technologies: Spring Boot (Java) | Angular (TypeScript) | PostgreSQL | Git

---

## 🚀 Project Overview

This project aims to develop a **web platform for boat rental**, allowing users to:

- Search for boats based on filters (type, price, availability)
- Book boats by selecting dates
- View booking history from their user dashboard
- Simulate payments (future integrations: Clicktopay Tunisia, PayPal Dubai)

The application also includes a **multi-role access system**:  
`Guest`, `Client`, `Manager`, `Administrator`.

---

## 🧩 Features

### 👤 User Features (Frontend - Angular)

- Sign up / Login (via email & password or social login)
- Search for boats (filters: type, price, availability)
- View boat details (photos, description, price, status)
- Make reservations (choose dates, simulate payment)
- View reservation history from dashboard

### 👨‍💼 Admin Features (Backend - Spring Boot)

- Boat Management (CRUD: Create, Read, Update, Delete)
- Reservation Validation (Accept / Reject)
- User Management (list, block if needed)

---

## 🗃️ Database (PostgreSQL)

### Main Tables:
- `Users (id, name, email, password, role)`
- `Boats (id, name, description, price, availability, images)`
- `Reservations (id, user_id, boat_id, date, status)`

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

